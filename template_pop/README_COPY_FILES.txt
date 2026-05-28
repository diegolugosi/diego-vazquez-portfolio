Files that must be copied manually from your original template folder:

Source folder:
C:\Users\Beliv\OneDrive\Desktop\2097_pop\

Copy these binaries into the corresponding paths in this repo:

Images:
  img/gallery-img-01-tn.jpg  -> template_pop/img/
  img/gallery-img-02-tn.jpg  -> template_pop/img/
  img/gallery-img-03-tn.jpg  -> template_pop/img/
  img/gallery-img-04-tn.jpg  -> template_pop/img/
  img/gallery-img-05-tn.jpg  -> template_pop/img/
  img/gallery-img-06-tn.jpg  -> template_pop/img/
  img/pop-bg.jpg             -> template_pop/img/
  img/team.jpg               -> template_pop/img/
  img/underline.png          -> template_pop/img/
  img/welcome-1.jpg          -> template_pop/img/
  img/welcome-2.jpg          -> template_pop/img/

Font files:
  fontawesome/webfonts/*     -> template_pop/fontawesome/webfonts/
  slick/fonts/*              -> template_pop/slick/fonts/

Notes:
- Binary image/font files are not copied automatically by this script due to workspace restrictions. Please copy them manually from the original template folder into the `template_pop/` subfolders.
- After copying, open `template_pop/index.html` in a browser (serve via `py -m http.server 8000`) to verify everything loads correctly.
