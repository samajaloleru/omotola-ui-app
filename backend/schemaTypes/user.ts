export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'rank',
            title: 'Rank',
            type: 'string', 
        },
        {
            name: 'fullName',
            title: 'FullName',
            type: 'string', 
        },
        {
            name: 'email',
            title: 'Email Address',
            type: 'string', 
        },
        {
            name: 'mobile',
            title: 'Phone No',
            type: 'string', 
        },
        {
            name: 'day',
            title: 'Days',
            type: 'string', 
        },
        {
            name: 'month',
            title: 'Month',
            type: 'string', 
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
    ]
}