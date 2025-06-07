export const urls = {
    // Complaints
    createComplaint: '/complaints',
    getComplaints: '/complaints',
    getComplaint: (id: string) => `/complaints/${id}`,
    rejectComplaint: '/complaints/reject',
    acceptComplaint: '/complaints/accept',
    requestChanges: '/complaints/requestChanges',
    getComplaintsTotals: '/complaints/totals',

    // Violations
    getViolations: '/violations/groups'
}