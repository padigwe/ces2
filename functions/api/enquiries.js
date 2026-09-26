export async function onRequestPost({ request, env }) {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin)
        return Response.json({ error: 'Please send this form from the CES website.' }, { status: 403 });
    try {
        const raw = await request.text();
        if (raw.length > 12000)
            return Response.json({ error: 'Your message is too long.' }, { status: 413 });
        const b = JSON.parse(raw);
        if (b.website)
            return Response.json({ error: 'Unable to accept this enquiry.' }, { status: 400 });
        const limits = { name: 100, email: 200, phone: 35, postcode: 15, message: 4000 };
        for (const [key, max] of Object.entries(limits)) {
            if (typeof b[key] !== 'string' || b[key].length > max)
                return Response.json({ error: 'Please check your contact details and message.' }, { status: 400 });
            b[key] = b[key].trim();
        }
        if (!b.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) || !b.postcode || b.message.length < 10 || !['electrical', 'security', 'renewables', 'multiple'].includes(b.service) || !['residential', 'commercial', 'industrial', 'other'].includes(b.customer) || typeof b.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(b.id))
            return Response.json({ error: 'Please complete all required fields with valid details.' }, { status: 400 });
        await env.DB.prepare('INSERT INTO enquiries (id,name,email,phone,postcode,service,customer,message,created_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(b.id, b.name, b.email, b.phone, b.postcode, b.service, b.customer, b.message, new Date().toISOString()).run();
        return Response.json({ reference: 'CES-' + b.id.slice(0, 8).toUpperCase() }, { status: 201 });
    }
    catch (e) {
        if (e instanceof SyntaxError)
            return Response.json({ error: 'Please check the enquiry and try again.' }, { status: 400 });
        console.error('Enquiry storage failed');
        return Response.json({ error: 'We couldn’t save your enquiry. Your details are still in the form. Please try again.' }, { status: 503 });
    }
}
