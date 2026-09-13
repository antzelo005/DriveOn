# Original demo photography

Generated with the built-in image generation tool. Final assets are local AVIF with WebP fallbacks; the hero has a 768px responsive variant and a separately designed 1200×630 JPEG social card. No external stock-photo service is used. All scenes and people are fictional.

## Final refinement

AVIF quality 55, generated from the original PNGs, reduces the car from 241,756 to 120,726 bytes (50%), small car from 79,562 to 43,623 (45%), team from 106,424 to 65,423 (39%), motorcycle from 206,186 to 115,383 (44%). Existing WebP files remain as fallbacks. The `Photo` component uses native picture/source selection; no image library was added.

Social card source: built-in generated image `exec-b331051b-ab99-4f1f-9bf5-55332a353a17.png`, using the original car photo as a reference. Final `public/images/social.jpg`: 1200×630, 145,884 bytes. Prompt: preserve the recognizable white car and Athens setting; create a premium dark petrol navy / warm yellow sharing layout, DRIVEON arrow wordmark, exact Greek headlines “Το δίπλωμά σου.” and “Η ελευθερία σου.”, and “ΣΧΟΛΗ ΟΔΗΓΩΝ · CONCEPT DEMO”. No phone/address/review claims. Typography and crop were visually reviewed. This card also requires replacement for client mode because its demo label is part of the pixels.

## Hero and car

Saved asset: `public/images/driveon-car.webp`

Prompt:

> Use case: photorealistic-natural. Asset type: premium Greek driving school website hero photograph, landscape 3:2. A pearl white modern compact European learner hatchback with a small yellow driving school roof sign reading DRIVEON and subtle narrow yellow stripe along doors, parked on a quiet sunlit residential street in Athens, clean pale concrete Greek apartment facades and olive trees softly out of focus, warm late afternoon daylight. Front three-quarter view of the entire car facing left, shot at car height, car occupies lower middle 65 percent of image. Natural realistic professional editorial automotive photography, welcoming and attainable not luxury, tasteful soft warm film grade, cream stone, slate and olive tones. No people, no other text, no watermarks, no collage, no graphics. Keep full car inside frame with generous space above. Accurate wheels and perspective.

## Team

Saved asset: `public/images/driveon-team.webp`

Prompt:

> Use case: photorealistic-natural. Asset: wide editorial team photograph for fictional Athens driving school DRIVEON. Three friendly Greek driving instructors standing side by side outdoors beside a white compact learner car: left man age 44 short dark hair light stubble, middle woman age 34 shoulder-length brown hair, right man age 38 short dark hair. Wearing tasteful plain navy polo shirts, woman cream shirt, casual professional. All looking at camera with warm natural smiles, relaxed arms. Pale Greek neighbourhood architecture and olive tree background softly blurred. Waist-up composition with all three evenly spaced, warm natural late afternoon light, realistic skin texture, restrained cinematic warm cream/navy palette, high end approachable editorial photography. Landscape 3:2. No text, no watermarks.

## Motorcycle

Saved asset: `public/images/driveon-motorcycle.webp`

Prompt:

> Use case: photorealistic-natural. Asset: premium driving school motorcycle training photograph landscape 3:2. Matte dark navy mid-size naked road motorcycle, similar to a 500cc learner motorcycle, parked in front three-quarter profile facing left on quiet pale concrete urban practice area in Athens. Small orange training cones behind, pale cream Greek buildings and olive trees softly blurred. No people. Full motorcycle in frame including wheels, helmet resting on seat, warm natural afternoon light, restrained warm editorial grade coordinated with white learner car photography. High quality realistic approachable driving lesson feeling, not racing or luxury advertising. No text, no watermarks.
