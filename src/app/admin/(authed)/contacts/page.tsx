import { Inbox } from "lucide-react";
import { listContacts } from "@/lib/appwrite/contacts";
import ContactRow from "@/components/admin/ContactRow";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const contacts = await listContacts();
  const newCount = contacts.filter((c) => c.status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-1">Contact Submissions</h1>
        <p className="text-gray-600 text-sm">
          {contacts.length} total · {newCount} new
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <Inbox size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No contact submissions yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Submissions from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <ContactRow key={contact.$id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}
