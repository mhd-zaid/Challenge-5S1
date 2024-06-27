
const url = import.meta.env.VITE_BACKEND_URL;

const CompanyService = {
    get_company_detail: async (token, id) => {
        try {
        const response = await fetch(`${url}/companies/${id}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/ld+json',
            Authorization: `Bearer ${token}`,
            },
        });
        return response;
        } catch (error) {
        console.error("An error occurred during getting all plans:", error);
        throw error;
        }
    },

};

export default CompanyService;