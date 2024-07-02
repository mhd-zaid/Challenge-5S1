
const url = import.meta.env.VITE_BACKEND_URL;

const ReservationService = {
    replace_reservation: async (token, reservation) => {
        try {
            const response = await fetch(`${url}/reservations/${reservation.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reservation),
            });
            return response;
        } catch (error) {
            console.error("An error occurred during replacing a reservation:", error);
            throw error;
        }
    },
};

export default ReservationService;
    