export default function ProfileCard({ name, major, status }) {
    return (
      <div className="border rounded-lg shadow p-4 bg-white">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-600">{major}</p>
        {status && <p className="text-sm text-blue-500">{status}</p>}
      </div>
    )
  }
  