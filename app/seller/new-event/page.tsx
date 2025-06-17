import EventForm from "@/components/EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Créer un nouvel événement</h2>
          <p className="text-orange-100 mt-2">
            Listez votre événement et commencez à vendre vos billets
          </p>
        </div>

        <div className="p-6">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
}
