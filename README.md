# verligte

npm install
npm run dev

Every component lives in its own folder: src/components/<Name>/<Name>.jsx + <Name>.css
Shared hook: src/hooks/useInView.js
Logo pieces (generated from the original logo): src/components/Logo/logoPieces.js
Regenerate: python tools/make_logo_pieces.py logo.png src/components/Logo/logoPieces.js
