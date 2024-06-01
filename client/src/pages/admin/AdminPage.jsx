import { HydraAdmin, ResourceGuesser } from '@api-platform/admin';

const AdminPage = () => {
  return (
    <>
      <HydraAdmin entrypoint="https://localhost/api">
        <ResourceGuesser name="companies" />
        <ResourceGuesser name="reservations" />
        <ResourceGuesser name="services" />
        <ResourceGuesser name="studios" />
        <ResourceGuesser name="studio_opening_times" />
        <ResourceGuesser name="unavailability_hours" />
        <ResourceGuesser name="users" />
        <ResourceGuesser name="work_hours" />
      </HydraAdmin>
    </>
  );
};

export default AdminPage;