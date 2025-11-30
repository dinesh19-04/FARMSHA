import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';

interface Message {
    id: string;
    sender: 'me' | 'other';
    text: string;
    timestamp: Date;
}

interface ChatWindowProps {
    recipientName: string;
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ recipientName, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'other', text: 'Hello! How can I help you?', timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'me',
            text: inputText,
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        setInputText('');

        // Simulate reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'other',
                text: 'I will check and get back to you shortly.',
                timestamp: new Date()
            }]);
        }, 2000);
    };

    return (
        <Card className="fixed bottom-4 right-4 w-80 shadow-xl z-50 border-green-200">
            <CardHeader className="bg-green-600 text-white p-3 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium">{recipientName}</CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-green-700" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-64 overflow-y-auto p-3 space-y-3 bg-gray-50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.sender === 'me'
                                        ? 'bg-green-500 text-white rounded-br-none'
                                        : 'bg-white border text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSend} className="p-3 border-t flex gap-2 bg-white">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 h-8 text-sm"
                    />
                    <Button type="submit" size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChatWindow;
