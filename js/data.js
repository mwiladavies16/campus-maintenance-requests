/*
====================================================
 CAMPUS MAINTENANCE REQUESTS MANAGEMENT SYSTEM
 ICT251 - ACTIVITY 6
 DATA MANAGEMENT SERVICE
 Mulungushi University
====================================================
*/

// 1. LocalStorage key
const KEY = "maintenance-demo-v1";


// 2. Starting demonstration records
const startingRecords = [
    {
        id: 1,
        title: "Broken classroom light",
        category: "Electrical",
        description: "The light in Room B12 does not switch on.",
        status: "Pending"
    },
    {
        id: 2,
        title: "Leaking bathroom tap",
        category: "Plumbing",
        description: "The tap in the male student bathroom is leaking.",
        status: "In progress"
    },
    {
        id: 3,
        title: "Damaged classroom desk",
        category: "Furniture",
        description: "One of the desks in Room A05 has a broken leg.",
        status: "Completed"
    },
    {
        id: 4,
        title: "Faulty electrical socket",
        category: "Electrical",
        description: "The electrical socket in the computer laboratory is not working.",
        status: "Pending"
    },
    {
        id: 5,
        title: "Blocked drainage pipe",
        category: "Plumbing",
        description: "Water is not draining properly near the library.",
        status: "In progress"
    },
    {
        id: 6,
        title: "Broken office chair",
        category: "Furniture",
        description: "The chair in the administration office is damaged.",
        status: "Completed"
    },
    {
        id: 7,
        title: "Classroom ceiling light failure",
        category: "Electrical",
        description: "Several ceiling lights in Room C10 are not functioning.",
        status: "Pending"
    },
    {
        id: 8,
        title: "Water pipe leakage",
        category: "Plumbing",
        description: "A water pipe is leaking outside the lecture theatre.",
        status: "In progress"
    }
];


// 3. Initialize localStorage
// Starting records are added only if the key does not exist.

if (localStorage.getItem(KEY) === null) {
    localStorage.setItem(KEY, JSON.stringify(startingRecords));
}


// 4. Helper function to read records
function readRecords() {
    const savedData = localStorage.getItem(KEY);

    if (savedData === null) {
        return [];
    }

    const records = JSON.parse(savedData);

    if (!Array.isArray(records)) {
        throw new Error("Stored maintenance data is invalid.");
    }

    return records;
}


// 5. Helper function to save records
function saveRecords(records) {
    localStorage.setItem(KEY, JSON.stringify(records));
}


// 6. Record Service
export const recordService = {

    // Retrieve all records
    async list() {
        return readRecords();
    },


    // Retrieve one record using its ID
    async get(id) {
        const records = readRecords();

        const record = records.find(item => item.id === Number(id));

        if (!record) {
            throw new Error("Maintenance record not found.");
        }

        return record;
    },


    // Create a new record
    async create(record) {
        const records = readRecords();

        // Generate a unique positive ID
        const highestId = records.reduce(
            (highest, item) => Math.max(highest, item.id),
            0
        );

        const newRecord = {
            id: highestId + 1,
            title: record.title.trim(),
            category: record.category.trim(),
            description: record.description.trim(),
            status: record.status
        };

        records.push(newRecord);

        saveRecords(records);

        return newRecord;
    },


    // Update an existing record
    async update(id, record) {
        const records = readRecords();

        const index = records.findIndex(
            item => item.id === Number(id)
        );

        if (index === -1) {
            throw new Error("Maintenance record not found.");
        }

        const updatedRecord = {
            id: records[index].id,
            title: record.title.trim(),
            category: record.category.trim(),
            description: record.description.trim(),
            status: record.status
        };

        records[index] = updatedRecord;

        saveRecords(records);

        return updatedRecord;
    },


    // Delete a record
    async remove(id) {
        const records = readRecords();

        const updatedRecords = records.filter(
            item => item.id !== Number(id)
        );

        if (updatedRecords.length === records.length) {
            throw new Error("Maintenance record not found.");
        }

        saveRecords(updatedRecords);

        return "Maintenance record deleted successfully.";
    }

};