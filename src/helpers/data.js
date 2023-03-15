export const areas = [
    {
        id: 1,
        name: 'um al summaq'
    },
    {
        id: 2,
        name: 'Jabal Weibdeh'
    },
    {
        id: 3,
        name: 'jabal al hussein'
    },
    {
        id: 4,
        name: 'Khalda'
    },
    {
        id: 5,
        name: 'AL gardens'
    },
    {
        id: 6,
        name: 'al rabieh'
    },
    {
        id: 7,
        name: 'dahiet al rasheed'
    },
    {
        id: 8,
        name: 'dahyet al nakheel'
    },
    {
        id: 9,
        name: 'Hay Al Sahaba'
    },
];

export const salesdata = [
    {
        id: 1,
        pharm_name: 'test pharm 1',
        location: 'Jabal Weibdeh',
        items: [
            {
                item_id: 1,
                item_name: 'test item 1',
                items_sum: 12,
                bonus: 0,
                price: 20
            },
            {
                item_id: 2,
                item_name: 'test item 2',
                items_sum: 20,
                bonus: 3,
                price: 20
            },
        ]
    },
    {
        id: 2,
        pharm_name: 'test pharm 2',
        location: 'Hay Al Sahaba',
        items: [
            {
                item_id: 1,
                item_name: 'test item 1',
                items_sum: 12,
                bonus: 0,
                price: 20
            },
            {
                item_id: 2,
                item_name: 'test item 2',
                items_sum: 20,
                bonus: 3,
                price: 20
            },
            {
                item_id: 3,
                item_name: 'test item 3',
                items_sum: 50,
                bonus: 4,
                price: 20
            },
            {
                item_id: 4,
                item_name: 'test item 4',
                items_sum: 50,
                bonus: 4,
                price: 20
            },
            {
                item_id: 5,
                item_name: 'test item 5',
                items_sum: 50,
                bonus: 4,
                price: 20
            },
            {
                item_id: 6,
                item_name: 'test item 6',
                items_sum: 50,
                bonus: 4,
                price: 20
            },
            {
                item_id: 7,
                item_name: 'test item 7',
                items_sum: 50,
                bonus: 4,
                price: 20
            },
        ]
    },
    {
        id: 3,
        pharm_name: 'test pharm 3',
        location: 'dahiet al rasheed',
        items: [
            {
                item_id: 1,
                item_name: 'test item 1',
                items_sum: 12,
                bonus: 0,
                price: 20
            },
            {
                item_id: 2,
                item_name: 'test item 2',
                items_sum: 20,
                bonus: 3,
                price: 20
            },
            {
                item_id: 3,
                item_name: 'test item 3',
                items_sum: 50,
                bonus: 4,
                price: 20
            },
        ]
    },
]

export const Monthes = [
    {
        id: 1,
        name: 'January',
        days: 31
    },
    {
        id: 2,
        name: 'February',
        days: 28
    },
    {
        id: 3,
        name: 'March',
        days: 31
    },
    {
        id: 4,
        name: 'April',
        days: 30
    },
    {
        id: 5,
        name: 'May',
        days: 31
    },
    {
        id: 6,
        name: 'June',
        days: 30
    },
    {
        id: 7,
        name: 'July',
        days: 31
    },
    {
        id: 8,
        name: 'August',
        days: 31
    },
    {
        id: 9,
        name: 'September',
        days: 30
    },
    {
        id: 10,
        name: 'October',
        days: 31
    },
    {
        id: 11,
        name: 'November',
        days: 30
    },
    {
        id: 12,
        name: 'December',
        days: 31
    },
]

export const doctors = [
    {
        id: 1,
        docname: 'test doc 1',
        Specialty: 'Surgery',
        class: 'Class A'
    },
    {
        id: 2,
        docname: 'test doc 2',
        Specialty: 'Anesthesiology',
        class: 'Class C'
    },
    {
        id: 3,
        docname: 'test doc 3',
        Specialty: 'Dermatology',
        class: 'Class B'
    },
    {
        id: 4,
        docname: 'test doc 4',
        Specialty: 'Anesthesiology',
        class: 'Class A'
    },
    {
        id: 5,
        docname: 'test doc 5',
        Specialty: 'Neurology',
        class: 'Class C'
    },
]

export const Specialty = [
    {
        id: 1,
        sp_name: 'Surgery'
    },
    {
        id: 2,
        sp_name: 'Anesthesiology'
    },
    {
        id: 3,
        sp_name: 'Dermatology'
    },
    {
        id: 4,
        sp_name: 'Diagnostic radiology'
    },
    {
        id: 5,
        sp_name: 'Neurology'
    },
    {
        id: 6,
        sp_name: 'Pediatrics'
    },
]

export const classification = [
    {
        id: 1,
        clname: 'Class A',
    },
    {
        id: 2,
        clname: 'Class B',
    },
    {
        id: 3,
        clname: 'Class C',
    },
    {
        id: 4,
        clname: 'Class D',
    },
]

export const drugs = [
    {
        drug_id: 1,
        drug_name: 'Panadol - Extra',
    },
    {
        drug_id: 2,
        drug_name: 'Panadol - Advance',
    },
    {
        drug_id: 3,
        drug_name: 'Drug test 3',
    },
    {
        drug_id: 4,
        drug_name: 'Drug test 4',
    },
]

export const pharams = [
    {
        id: 1,
        pname: 'test 1 pharm',
        location: 'um al summaq',
        class: 'Class A'
    },
    {
        id: 2,
        pname: 'test 2 pharm',
        location: 'Jabal Weibdeh',
        class: 'Class B'
    },
    {
        id: 3,
        pname: 'test 3 pharm',
        location: 'Khalda',
        class: 'Class C'
    },
    {
        id: 4,
        pname: 'test 4 pharm',
        location: 'AL gardens',
        class: 'Class B'
    },
    {
        id: 5,
        pname: 'test 5 pharm',
        location: 'al rabieh',
        class: 'Class A'
    },
]