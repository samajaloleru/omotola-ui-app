export default {
    name: 'formDetail',
    title: 'FormDetail',
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
            name: 'gender',
            title: 'Gender',
            type: 'string', 
        },
        {
            name: 'homeAddress',
            title: 'Home Address',
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
            name: 'verified',
            title: 'Verified',
            type: 'boolean', 
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