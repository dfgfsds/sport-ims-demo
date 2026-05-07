import Modal from '../../components/UI/Modal';


function ClubResultModal({ open, close, resultData }: any) {

    return (
        <>
            <Modal
                isOpen={open}
                onClose={() => close()}
                title={`Result Detail ${resultData?.name}`}
                size="xl"
            >
                <div className="space-y-6">
                    {/* Player Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Player Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div><strong>Name:</strong> {resultData?.name || '-'}</div>
                            <div><strong>Player ID:</strong> {resultData?.registration?.playerId || '-'}</div>
                            <div>
                                <strong>DOB:</strong>{' '}
                                {resultData?.registration?.dob
                                    ? new Date(resultData.registration.dob).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : '-'}
                            </div>
                            <div><strong>Category:</strong> {resultData?.registration?.skateCategory.toUpperCase() || '-'}</div>
                            <div><strong>Age Group:</strong> {resultData?.registration?.ageGroup || '-'}</div>
                            <div><strong>Chest Number:</strong> {resultData?.registration?.chestNumber || '-'}</div>
                            <div><strong>Profile Image:</strong><br />
                                {resultData?.registration?.profileImageUrl ? (
                                    <img
                                        src={resultData?.registration.profileImageUrl}
                                        alt="Player"
                                        className="mt-2 w-24 h-24 object-cover rounded"
                                    />
                                ) : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Registration Info */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-2">Registration Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div><strong>Club:</strong> {resultData?.registration?.clubName || '-'}</div>
                            <div><strong>Payment ID:</strong> {resultData?.registration?.paymentId || '-'}</div>
                            <div><strong>Amount Paid:</strong> ₹{resultData?.registration?.amountPaid || '-'}</div>
                            <div>
                                <strong>Registration Date:</strong>{' '}
                                {resultData?.registration?.regDate
                                    ? new Date(resultData.registration.regDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : '-'}
                            </div>
                            <div><strong>Remarks:</strong> {resultData?.registration?.remarks || '-'}</div>
                        </div>
                    </div>

                    {/* Event Info */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-medium text-yellow-900 mb-2">Event Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div><strong>Event Name:</strong> {resultData?.registration?.event?.name || '-'}</div>
                            <div>
                                <strong>Event Date:</strong>{' '}
                                {resultData?.registration?.event?.eventDate
                                    ? new Date(resultData.registration.event.eventDate)
                                        .toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })
                                    : '-'}
                            </div>
                            <div><strong>Venue:</strong> {resultData?.registration?.event?.venue || '-'}</div>
                        </div>
                    </div>

                    {/* Selected Races */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-medium text-purple-900 mb-2">Selected Races</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                            {resultData?.registration?.selectedRaces.length > 0 ? (
                                resultData?.registration?.selectedRaces.map((race: any) => (
                                    <li key={race.id}>{race.name}</li>
                                ))
                            ) : (
                                <li>No races selected</li>
                            )}
                        </ul>
                    </div>
                </div>

            </Modal>

        </>
    )
}
export default ClubResultModal;