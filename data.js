// ---------------------------------------------------------------------------
// Cool Stuff Sticker Sheet : the data.
//
// This is the "JSON stuff" the whole sheet reads from. Each entry is one coded
// animation. To add a new one: drop its self-contained HTML into animations/,
// then add an object to the array below. The number on each card is just its
// position here, so reordering the array renumbers the sheet.
//
//   frame:  'desktop' renders a browser frame, 'mobile' renders a phone bezel.
//   status: 'live' shows the running animation, 'soon' shows a placeholder slot.
// ---------------------------------------------------------------------------

window.STICKERS = [
  {
    id: 'checkout-flow',
    title: 'Checkout Flow',
    blurb: 'A modern checkout that builds itself on screen, field by field, then settles into a clean confirmation.',
    tag: 'Desktop · live build',
    src: 'animations/checkout-flow.html',
    frame: 'desktop',
    status: 'live',
  },
  {
    id: 'blue-stream',
    title: 'Blue Stream Fiber: Tech Visit',
    blurb: 'A senior redesign of the tech-visit flow. Client work, so the live walkthrough is shared privately rather than on this public page.',
    tag: 'Mobile · shared privately',
    src: null,
    frame: 'mobile',
    status: 'soon',
    note: 'Shared privately',
  },
  {
    id: 'in-the-room',
    title: 'In the Room',
    blurb: 'A warm, paper-toned recording screen that animates the moment a session is being captured.',
    tag: 'Desktop · live build',
    src: 'animations/in-the-room.html',
    frame: 'desktop',
    status: 'live',
  },
];
