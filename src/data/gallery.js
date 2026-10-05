const ASSET = (path) => `https://adi049.github.io/DivinePublicSchool/${path.replace(/^\/+/, '')}`

export const GALLERY_CATEGORIES = ['Campus','Classrooms','Events','Activities','Sports','Cultural Programs','Celebrations','Students','Other']

const image = (name, caption, alt, category) => ({ src: ASSET(`/images/gallery/${name}`), caption, alt, category })

export const GALLERY_IMAGES = [
 image('campus-front.jpg','The school campus on a working morning','Front view of the Divine Public School campus with students walking in','Campus'),
 image('library.jpg','Quiet reading time in the school library','Students reading books in the school library','Campus'),
 image('classroom.jpg','A lesson in progress','Teacher explaining a lesson on the board in a classroom','Classrooms'),
 image('classroom-activity.jpg','Hands up — an eager classroom activity','Primary school students raising hands during a classroom activity','Classrooms'),
 image('annual-day.jpg','Annual Day stage performance','Students in costume performing on stage at the annual day','Events'),
 image('science-exhibition.jpg','Science exhibition — learning by doing','Students presenting models at the school science exhibition','Events'),
 image('art-craft.jpg','Art & craft period in the junior wing','Junior students painting during art and craft period','Activities'),
 image('music-class.jpg','Music class','Students learning instruments during a music class','Activities'),
 image('football.jpg','Football practice on the school ground','Students playing football on the school sports ground','Sports'),
 image('sports-day.jpg','Race day — annual sports meet','Students running a race during the annual sports day','Sports'),
 image('cultural-dance.jpg','Classical dance at a cultural programme','Student performing classical dance at a school cultural programme','Cultural Programs'),
 image('independence-day.jpg','Independence Day celebrations','Independence Day celebration with the national flag on campus','Celebrations'),
 image('students-group.jpg','Between classes — our senior students','Group of students in uniform walking along the school corridor','Students'),
 image('morning-assembly.jpg','The morning assembly','Students standing in rows during the morning assembly','Other'),
]
