export default {
    name: 'accessLog',
    title: 'Access Log',
    type: 'document',
    readOnly: true,
    fields: [
        {
            name: 'fullName',
            title: 'Full Name',
            type: 'string',
        },
        {
            name: 'mobile',
            title: 'Phone No',
            type: 'string',
        },
        {
            name: 'granted',
            title: 'Access Granted',
            type: 'boolean',
        },
        {
            name: 'page',
            title: 'Page',
            type: 'string',
        },
        {
            name: 'attemptedAt',
            title: 'Attempted At',
            type: 'datetime',
        },
        {
            name: 'ipAddress',
            title: 'IP Address',
            type: 'string',
        },
        {
            name: 'userAgent',
            title: 'Browser / Device',
            type: 'text',
            rows: 2,
        },
    ],
    orderings: [
        {
            title: 'Newest first',
            name: 'attemptedAtDesc',
            by: [{ field: 'attemptedAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: {
            fullName: 'fullName',
            mobile: 'mobile',
            granted: 'granted',
            attemptedAt: 'attemptedAt',
        },
        prepare({ fullName, mobile, granted, attemptedAt }: Record<string, any>) {
            const when = attemptedAt ? new Date(attemptedAt).toLocaleString() : 'Unknown time';
            return {
                title: `${granted ? '✅' : '⛔'} ${fullName || 'Unknown'}`,
                subtitle: `${mobile || 'No phone'} · ${when}`,
            };
        },
    },
}
