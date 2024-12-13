import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PlusIcon, SearchIcon } from 'lucide-react';

const DebtTracker = () => {
  const [contacts, setContacts] = useState([]);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    amount: '',
    dueDate: ''
  });

  // Simulated phone contacts (in real app, this would come from device/browser)
  useEffect(() => {
    // Simulated contact list
    const mockContacts = [
      { id: 1, name: "John Doe", phone: "+1 (555) 123-4567" },
      { id: 2, name: "Jane Smith", phone: "+1 (555) 987-6543" },
      { id: 3, name: "Alice Johnson", phone: "+1 (555) 246-8135" },
      { id: 4, name: "Bob Williams", phone: "+1 (555) 369-2580" }
    ];
    setPhoneContacts(mockContacts);
  }, []);

  // Request contact access (browser API)
  const requestContactAccess = async () => {
    if ('contacts' in navigator && 'select' in navigator.contacts) {
      try {
        const contacts = await navigator.contacts.select(['name', 'tel']);
        // Process selected contacts
        const processedContacts = contacts.map(contact => ({
          name: contact.name[0],
          phone: contact.tel[0]
        }));
        setPhoneContacts(processedContacts);
      } catch (error) {
        console.error('Contact access error:', error);
        alert('Could not access contacts. Please check permissions.');
      }
    } else {
      alert('Contact access not supported in this browser');
    }
  };

  // Filter contacts based on search
  const filteredContacts = phoneContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  // Select contact for debt tracking
  const selectContactForDebt = (contact) => {
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      amount: '',
      dueDate: ''
    });
  };

  // Add new contact/debt
  const addContact = () => {
    if (newContact.name && newContact.amount) {
      setContacts([
        ...contacts, 
        {
          ...newContact,
          id: Date.now()
        }
      ]);
      // Reset form
      setNewContact({
        name: '',
        phone: '',
        amount: '',
        dueDate: ''
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Debt Tracker</CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Contact Selection Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mb-4">
                <PlusIcon className="mr-2" /> Add New Debt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[500px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Debt</DialogTitle>
              </DialogHeader>
              
              {/* Contact Search */}
              <div className="relative">
                <Input 
                  placeholder="Search contacts"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Contact Access Button */}
              <Button 
                variant="secondary" 
                onClick={requestContactAccess}
                className="w-full"
              >
                Access Phone Contacts
              </Button>

              {/* Filtered Contacts List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <Card 
                    key={contact.id} 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => selectContactForDebt(contact)}
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{contact.name}</h3>
                        <p className="text-gray-500">{contact.phone}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Debt Details Form */}
              <div className="space-y-4 mt-4">
                <Input 
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({
                    ...newContact, 
                    name: e.target.value
                  })}
                />
                <Input 
                  placeholder="Phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({
                    ...newContact, 
                    phone: e.target.value
                  })}
                />
                <Input 
                  type="number"
                  placeholder="Amount Owed"
                  value={newContact.amount}
                  onChange={(e) => setNewContact({
                    ...newContact, 
                    amount: e.target.value
                  })}
                />
                <Input 
                  type="date"
                  placeholder="Due Date"
                  value={newContact.dueDate}
                  onChange={(e) => setNewContact({
                    ...newContact, 
                    dueDate: e.target.value
                  })}
                />
                <Button 
                  onClick={addContact}
                  className="w-full"
                >
                  Save Debt
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Existing Debts List */}
          {contacts.length === 0 ? (
            <p className="text-center text-gray-500">
              No debts tracked yet
            </p>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <Card key={contact.id} className="w-full">
                  <CardContent className="p-4">
                    <h3 className="font-bold">{contact.name}</h3>
                    <p>Phone: {contact.phone}</p>
                    <p>Amount: ${contact.amount}</p>
                    <p>Due: {contact.dueDate}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DebtTracker;
