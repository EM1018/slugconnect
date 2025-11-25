import SendConnectionButton from './SendConnectionButton'

export default function ProfileCard({ name, major, status, id, year, college, interests }) {
    return (
      <div className="border rounded-lg shadow p-4 bg-white flex flex-col">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600">{major}</p>
          {year && <p className="text-sm text-gray-500">{year}</p>}
          {college && <p className="text-sm text-gray-500">{college}</p>}
          {status && <p className="text-sm text-blue-500 mt-1">{status}</p>}
          {interests && Array.isArray(interests) && interests.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {interests.slice(0, 3).map((interest, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {interest}
                </span>
              ))}
              {interests.length > 3 && (
                <span className="text-xs text-gray-400">+{interests.length - 3}</span>
              )}
            </div>
          )}
        </div>
        {id && <SendConnectionButton receiverId={id} receiverName={name} />}
      </div>
    )
  }
  