# Divine Public School — Weekly backup setup

The repository contains a scheduled backup workflow at `.github/workflows/weekly-supabase-backup.yml`. It runs every Sunday at 20:00 UTC (Monday 01:30 India time) and can also be started manually from GitHub Actions.

It exports database schema, data and roles, downloads all objects in the `school-media` bucket, compresses the backup and uploads it to a **private Google Drive** remote. Remote files older than 90 days are pruned.

The workflow is committed but cannot run successfully until the three GitHub Actions secrets below are configured. Backups contain parent contact details and must never be stored in this public GitHub repository or public artifacts.

## Required GitHub Actions secrets

Open GitHub → repository Settings → Secrets and variables → Actions → New repository secret.

### `SUPABASE_ACCESS_TOKEN`
Create a Supabase personal access token from the Supabase account Access Tokens page. This is used by the Supabase CLI to link the project and download Storage objects.

### `SUPABASE_DB_URL`
Use the **Session pooler** connection string from Supabase Dashboard → Connect. Replace the password placeholder locally before saving it as a secret. Prefer the session pooler URL because GitHub-hosted runners may not reach the project's direct IPv6 database host.

### `RCLONE_CONFIG_B64`
1. Install rclone locally and run `rclone config`.
2. Create a Google Drive remote named exactly `schooldrive`, authenticated to a private school-owned Google Drive account.
3. Confirm `rclone listremotes` shows `schooldrive:`.
4. Base64-encode the full rclone config file locally and save the output as the GitHub Actions secret `RCLONE_CONFIG_B64`.
   - Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("$env:APPDATA\rclone\rclone.conf")) | Set-Clipboard`
   - Linux/macOS: `base64 -w 0 ~/.config/rclone/rclone.conf`
5. Never commit the rclone config or paste its contents into chat.

## Run and verify

After adding all three secrets:
1. Open GitHub Actions → Weekly private Supabase backup.
2. Select Run workflow.
3. Confirm the run completes successfully.
4. Confirm a dated archive appears under `DivinePublicSchoolBackups` in the private Drive.
5. Repeat a restore drill into a separate test project before relying on the backup.

## Important plan note

This Supabase organization is currently on the Free plan. Supabase's built-in automatic daily database backups are not included on Free; Pro and higher plans include daily backups. This workflow is an external weekly backup route and only becomes active after the GitHub secrets and private Drive remote are configured.

The export includes the application database schema/data/roles and the `school-media` bucket objects. Supabase-managed Auth and Storage schemas are excluded by the CLI dump; recreate the admin Auth user when restoring, and restore the downloaded Storage objects separately. This is not a substitute for a tested disaster-recovery procedure.
