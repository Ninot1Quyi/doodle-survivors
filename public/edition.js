'use strict';
const EDITION=new URLSearchParams(location.search).get('edition')==='adventure'?'adventure':'paper';
document.documentElement.dataset.edition=EDITION;
