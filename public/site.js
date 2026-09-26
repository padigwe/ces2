const root = document.getElementById('ces-editorial');
const controller = new AbortController();
const listen = (el, type, handler) => el.addEventListener(type, handler, { signal: controller.signal });
const toggles = [...root.querySelectorAll('.ce-service-toggle')];
function openService(name) { toggles.forEach(button => { const active = button.dataset.service === name; button.setAttribute('aria-expanded', String(active)); root.querySelector('#' + button.getAttribute('aria-controls')).hidden = !active; button.querySelector('.ce-toggle-icon').textContent = active ? '−' : '+'; }); }
toggles.forEach(button => listen(button, 'click', () => openService(button.getAttribute('aria-expanded') === 'true' ? '' : button.dataset.service)));
const menu = root.querySelector('.ce-menu'), mobile = root.querySelector('#ce-mobile');
listen(menu, 'click', () => { const expanded = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!expanded)); mobile.hidden = expanded; });
const formPanel = root.querySelector('#ce-enquiry');
function openForm() { formPanel.hidden = false; root.querySelectorAll('button[aria-controls="ce-enquiry"]').forEach(button => button.setAttribute('aria-expanded', 'true')); }
root.querySelectorAll('button[aria-controls="ce-enquiry"]').forEach(button => listen(button, 'click', () => { openForm(); formPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }));
root.querySelectorAll('a[href^="#"]').forEach(link => listen(link, 'click', event => {
    const target = root.querySelector(link.getAttribute('href'));
    if (!target)
        return;
    event.preventDefault();
    if (link.dataset.open)
        openService(link.dataset.open);
    if (link.getAttribute('href') === '#ce-contact')
        openForm();
    if (link.dataset.enquiry) {
        openForm();
        window.dispatchEvent(new CustomEvent('ces:prefill', { detail: { service: link.dataset.enquiry } }));
    }
    if (link.dataset.property) {
        openForm();
        window.dispatchEvent(new CustomEvent('ces:prefill', { detail: { customer: link.dataset.property } }));
    }
    mobile.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}));
const section = new URLSearchParams(window.location.search).get('section');
if (section && ['electrical', 'security', 'renewables'].includes(section))
    openService(section);
if (window.location.hash === '#ce-contact' || new URLSearchParams(window.location.search).has('service'))
    openForm();

const enquiryForm=document.getElementById('enquiry-form'),errorBox=document.getElementById('form-error'),successBox=document.getElementById('form-success');
let enquiryKey=crypto.randomUUID();
window.addEventListener('ces:prefill',event=>{for(const key of ['service','customer']){const value=event.detail?.[key];const input=enquiryForm.elements.namedItem(key);if(value&&Array.from(input.options).some(option=>option.value===value))input.value=value;}});
const initialService=new URLSearchParams(location.search).get('service');
if(initialService&&Array.from(enquiryForm.elements.service.options).some(option=>option.value===initialService))enquiryForm.elements.service.value=initialService;
enquiryForm.addEventListener('submit',async event=>{event.preventDefault();if(!enquiryForm.reportValidity())return;const button=enquiryForm.querySelector('[type=submit]');button.disabled=true;button.textContent='Saving your enquiry…';errorBox.hidden=true;
try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(new FormData(enquiryForm)),id:enquiryKey})});let result;try{result=await response.json()}catch{throw new Error('The enquiry service is unavailable. Your details are still in the form. Please try again.');}if(!response.ok)throw new Error(result.error||'We could not save your enquiry. Please try again.');document.getElementById('enquiry-reference').textContent=result.reference;enquiryForm.hidden=true;successBox.hidden=false;successBox.setAttribute('tabindex','-1');successBox.focus();}
catch(error){errorBox.textContent=error.message;errorBox.hidden=false;}finally{button.disabled=false;button.textContent='Send project enquiry';}});
document.getElementById('new-enquiry').addEventListener('click',()=>{enquiryForm.reset();enquiryKey=crypto.randomUUID();successBox.hidden=true;enquiryForm.hidden=false;enquiryForm.elements.name.focus();});
