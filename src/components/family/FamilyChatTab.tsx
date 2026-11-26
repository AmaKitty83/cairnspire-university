import { useState } from 'react';
import {
  FAMILY_PEOPLE,
  type ChatMessage,
  type ChatRoom,
  type FamilyPersonProfile,
} from '../../services/familyHubService';

interface FamilyChatTabProps {
  activePerson: FamilyPersonProfile;
  canEdit: boolean;
  rooms: ChatRoom[];
  messages: ChatMessage[];
  onSendMessage: (chatId: string, text: string) => Promise<void>;
  onCreateRoom: (name: string, members: string[]) => Promise<void>;
}

export function FamilyChatTab({
  activePerson,
  canEdit,
  rooms,
  messages,
  onSendMessage,
  onCreateRoom,
}: FamilyChatTabProps) {
  const visibleRooms = rooms.filter(
    (r) => r.id === 'family' || r.members.includes(activePerson.name)
  );
  const [selectedRoomId, setSelectedRoomId] = useState(visibleRooms[0]?.id || 'family');
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);

  const [showNewRoom, setShowNewRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([activePerson.name]);

  const activeRoom =
    visibleRooms.find((r) => r.id === selectedRoomId) || visibleRooms[0] || null;
  const roomMessages = messages.filter((m) => m.chatId === (activeRoom?.id || 'family'));

  async function handleSend() {
    if (!canEdit || !activeRoom || !msgText.trim()) return;
    setSending(true);
    try {
      await onSendMessage(activeRoom.id, msgText.trim());
      setMsgText('');
    } finally {
      setSending(false);
    }
  }

  async function handleCreate() {
    if (!canEdit || selectedMembers.length < 2) return;
    await onCreateRoom(roomName.trim(), selectedMembers);
    setRoomName('');
    setShowNewRoom(false);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-lg font-bold text-[#1b4332]">💬 Family Chat</h2>
            <p className="text-xs text-[#40916c]">Strictly private inside Home and Garden.</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowNewRoom((v) => !v)}
              className="px-3 py-1.5 rounded-lg bg-[#edf6f0] text-[#1b4332] text-xs font-bold cursor-pointer"
            >
              ＋ New Chat
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {visibleRooms.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoomId(r.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer border ${
                activeRoom?.id === r.id
                  ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                  : 'bg-[#f4fbf6] text-[#1b4332] border-[#b7d8c2]'
              }`}
            >
              {r.name || r.members.filter((m) => m !== activePerson.name).join(', ')}
            </button>
          ))}
        </div>

        {showNewRoom && canEdit && (
          <div className="p-3 rounded-xl bg-[#f4fbf6] border border-[#74c69d] space-y-2 text-xs">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Chat name (optional)"
              className="w-full px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
            />
            <div className="flex flex-wrap gap-1.5">
              {FAMILY_PEOPLE.map((p) => {
                const picked = selectedMembers.includes(p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      if (p.name === activePerson.name) return;
                      setSelectedMembers((prev) =>
                        picked ? prev.filter((x) => x !== p.name) : [...prev, p.name]
                      );
                    }}
                    className={`px-2 py-1 rounded-full border text-[11px] font-bold cursor-pointer ${
                      picked ? 'bg-[#2d6a4f] text-white border-[#1b4332]' : 'bg-white border-[#b7d8c2]'
                    }`}
                  >
                    {p.emoji} {p.name}
                  </button>
                );
              })}
            </div>
            <button
              disabled={selectedMembers.length < 2}
              onClick={() => void handleCreate()}
              className="px-3 py-1 rounded bg-[#2d6a4f] text-white font-bold cursor-pointer disabled:opacity-50"
            >
              Start Chat
            </button>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {!roomMessages.length ? (
            <div className="text-xs text-[#52796f] text-center py-6">No messages yet. Say hi!</div>
          ) : (
            roomMessages.map((m) => {
              const mine = m.sender === activePerson.name;
              const pObj = FAMILY_PEOPLE.find((p) => p.name === m.sender);
              return (
                <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] text-[#52796f] mb-0.5">
                    {pObj?.emoji || ''} {m.sender}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[85%] text-xs ${
                      mine
                        ? 'bg-[#2d6a4f] text-white'
                        : 'bg-[#edf6f0] text-[#1b4332] border border-[#dcefe2]'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {canEdit && activeRoom && (
          <div className="flex gap-2 pt-2 border-t border-[#dcefe2]">
            <input
              type="text"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleSend();
              }}
              placeholder={`Message as ${activePerson.name}...`}
              className="flex-1 px-3 py-2 rounded-xl border border-[#95d5b2] text-xs"
            />
            <button
              disabled={sending || !msgText.trim()}
              onClick={() => void handleSend()}
              className="px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
