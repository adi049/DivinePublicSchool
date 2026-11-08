import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const expected = Deno.env.get("ENQUIRY_WEBHOOK_SECRET");
  const supplied = req.headers.get("x-webhook-secret");
  if (!expected || !supplied || supplied !== expected) return json({ error: "Unauthorized" }, 401);

  let enquiry: Record<string, unknown>;
  try { enquiry = await req.json(); }
  catch { return json({ error: "Invalid JSON body" }, 400); }

  const parent = String(enquiry.parent_name ?? "").slice(0, 120);
  const student = String(enquiry.student_name ?? "").slice(0, 120);
  const phone = String(enquiry.phone ?? "").slice(0, 20);
  const email = String(enquiry.email ?? "").slice(0, 200);
  const className = String(enquiry.class_interested ?? "").slice(0, 80);
  const type = String(enquiry.enquiry_type ?? "contact").slice(0, 40);
  const message = String(enquiry.message ?? "").slice(0, 1500);
  const createdAt = String(enquiry.created_at ?? new Date().toISOString());
  const safe = { parent: escapeHtml(parent), student: escapeHtml(student), phone: escapeHtml(phone), email: escapeHtml(email), className: escapeHtml(className), type: escapeHtml(type), message: escapeHtml(message), createdAt: escapeHtml(createdAt) };

  if (!parent || !phone || !email || !className) return json({ error: "Required enquiry fields are missing" }, 400);

  const tasks: Promise<Response>[] = [];
  const outcomes: Record<string, string> = {};

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
  const notifyEmail = Deno.env.get("NOTIFY_EMAIL_TO") ?? "divinepublicschoolfirst@gmail.com";

  if (resendKey && fromEmail) {
    tasks.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        subject: `New ${type === "admissions" ? "admission" : "website"} enquiry — ${parent}`,
        html: `
          <h2>New enquiry received — Divine Public School</h2>
          <p><b>Type:</b> ${safe.type}</p>
          <p><b>Parent/Guardian:</b> ${safe.parent}</p>
          <p><b>Student:</b> ${safe.student || "Not provided"}</p>
          <p><b>Phone:</b> ${safe.phone}</p>
          <p><b>Email:</b> ${safe.email}</p>
          <p><b>Class:</b> ${safe.className}</p>
          <p><b>Message:</b> ${safe.message || "No message"}</p>
          <p><b>Received:</b> ${safe.createdAt}</p>
        `,
      }),
    }).then(async r => {
      outcomes.email = r.ok ? "sent" : `failed:${r.status} ${(await r.text()).slice(0, 300)}`;
      return r;
    }));
  } else {
    outcomes.email = "not_configured";
  }

  const waToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const waPhoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  const waTo = Deno.env.get("WHATSAPP_TO_NUMBER");
  const waTemplate = Deno.env.get("WHATSAPP_TEMPLATE_NAME");
  const waLanguage = Deno.env.get("WHATSAPP_TEMPLATE_LANGUAGE") ?? "en";

  if (waToken && waPhoneId && waTo && waTemplate) {
    const graphVersion = Deno.env.get("META_GRAPH_API_VERSION") ?? "v22.0";
    tasks.push(fetch(`https://graph.facebook.com/${graphVersion}/${waPhoneId}/messages`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${waToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: waTo,
        type: "template",
        template: {
          name: waTemplate,
          language: { code: waLanguage },
          components: [{
            type: "body",
            parameters: [
              { type: "text", text: parent },
              { type: "text", text: phone },
              { type: "text", text: className },
              { type: "text", text: type },
            ],
          }],
        },
      }),
    }).then(async r => {
      outcomes.whatsapp = r.ok ? "sent" : `failed:${r.status} ${(await r.text()).slice(0, 300)}`;
      return r;
    }));
  } else {
    outcomes.whatsapp = "not_configured";
  }

  await Promise.allSettled(tasks);
  return json({ ok: true, notifications: outcomes });
});
