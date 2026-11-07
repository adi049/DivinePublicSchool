// ============================================================
// GALLERY DATA  —  EDITABLE
// ============================================================
// Photographs sourced from the official school website

import { assetUrl } from '../utils/assetUrl.js'
// (divinepublicschoolgurgaon.com) and stored locally in
// /public/images/gallery/. To add or replace photographs, place
// the file in that folder and update the entries below.
// `category` must be one of the values in GALLERY_CATEGORIES.
// ============================================================

export const GALLERY_CATEGORIES = ['Campus', 'Infrastructure', 'Celebrations']

export const GALLERY_IMAGES = [
  {
    src: assetUrl('/images/gallery/building-front.jpg'),
    caption: 'The main academic block of the school',
    alt: 'Main academic building of Divine Public School, Gurugram',
    category: 'Campus',
  },
  {
    src: assetUrl('/images/gallery/building-main.jpg'),
    caption: 'The school building and covered entrance canopy',
    alt: 'Wide view of the Divine Public School building with entrance canopy',
    category: 'Campus',
  },
  {
    src: assetUrl('/images/gallery/campus-lawn.jpg'),
    caption: 'The school lawn and covered walkway',
    alt: 'Lawn and covered walkway on the Divine Public School campus',
    category: 'Campus',
  },
  {
    src: assetUrl('/images/campus-entrance.jpg'),
    caption: 'The covered main entrance with the school signboard',
    alt: 'Covered entrance canopy and main doorway of Divine Public School',
    category: 'Campus',
  },
  {
    src: assetUrl('/images/gallery/playground-transport.jpg'),
    caption: 'School transport and the play area',
    alt: 'School buses parked beside the play area at Divine Public School',
    category: 'Infrastructure',
  },
  {
    src: assetUrl('/images/gallery/courtyard-play-area.jpg'),
    caption: 'The courtyard garden and swings',
    alt: 'School courtyard with potted plants, swings and a school bus',
    category: 'Infrastructure',
  },
  {
    src: assetUrl('/images/gallery/janmashtami-matki-1.jpg'),
    caption: 'Janmashtami celebrations — matki activity',
    alt: 'Students in traditional dress during Janmashtami matki activity at school',
    category: 'Celebrations',
  },
  {
    src: assetUrl('/images/gallery/janmashtami-matki-2.jpg'),
    caption: 'Our little Radhas and Krishnas on Janmashtami',
    alt: 'Young students dressed in festive attire for Janmashtami',
    category: 'Celebrations',
  },
  {
    src: assetUrl('/images/gallery/janmashtami-classroom.jpg'),
    caption: 'Class group on Janmashtami',
    alt: 'Class group photograph in a decorated classroom on Janmashtami',
    category: 'Celebrations',
  },
]
