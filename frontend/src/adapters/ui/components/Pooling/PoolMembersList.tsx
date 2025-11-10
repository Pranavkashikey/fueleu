import React from 'react';
import type { PoolMember } from '../../../../core/domain/entities/Pool';

interface Props {
  members: PoolMember[];
  selectedMembers: string[];
  onToggleMember: (shipId: string) => void;
}

const PoolMembersList: React.FC<Props> = ({ members, selectedMembers, onToggleMember }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 text-center text-sm font-semibold">Select</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Ship ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Ship Name</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Adjusted CB</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">CB Before</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">CB After</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No members available
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.shipId} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.shipId)}
                    onChange={() => onToggleMember(member.shipId)}
                    aria-label={`Select ship ${member.shipId}`}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium">{member.shipId}</td>
                <td className="px-4 py-3 text-sm">{member.shipName}</td>
                <td className={`px-4 py-3 text-sm text-right font-mono ${
                  member.adjustedCB >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {member.adjustedCB.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {member.cbBefore.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {member.cbAfter.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PoolMembersList;
