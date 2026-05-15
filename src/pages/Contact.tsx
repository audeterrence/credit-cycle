import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, MessageSquare, AlertCircle, Gift, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

type Topic = "credits" | "kiosk" | "rewards" | "other" | null;

const Contact = () => {
  const [topic, setTopic] = useState<Topic>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Phone input strictly enforces starting with 6 and max 9 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let onlyNumbers = e.target.value.replace(/\D/g, '');
    
    // If they pasted a number starting with the country code, clean it up
    if (onlyNumbers.startsWith('2376')) {
      onlyNumbers = onlyNumbers.substring(3);
    }

    // Enforce that the first digit MUST be 6
    if (onlyNumbers.length > 0 && onlyNumbers[0] !== '6') {
      setPhoneError("Cameroon mobile numbers must start with 6.");
      onlyNumbers = ''; // Reject the input
    } else {
      setPhoneError(""); // Clear error if it's correct
    }

    setPhoneNumber(onlyNumbers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check to ensure exactly 9 digits before allowing submission
    if (phoneNumber.length < 9) {
      setPhoneError("Phone number must be exactly 9 digits.");
      return; 
    }
    
    setPhoneError("");
    setIsSubmitted(true);
  };

  const getTopicPlaceholder = () => {
    switch (topic) {
      case "credits": return "Please explain the issue. E.g., 'I dropped off 20 bottles but my credits haven't updated...'";
      case "kiosk": return "Which kiosk did you visit? What was the problem? (e.g., 'The machine in Akwa was full...')";
      case "rewards": return "Which reward were you trying to claim? (e.g., 'The bakery didn't accept my voucher...')";
      default: return "How can our support team help you today?";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      
      <div className="bg-primary/10 py-12 border-b">
        <div className="container text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            We're Here to Help
          </h1>
          <p className="text-lg text-muted-foreground">
            Having trouble with your credits, a kiosk, or a reward? Let us know and our Douala-based support team will fix it.
          </p>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <MapPin className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Headquarters</h4>
                    <p className="text-muted-foreground text-sm">Douala, Cameroon</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Phone className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Call Support</h4>
                    <p className="text-muted-foreground text-sm">+237 6XX XXX XXX</p>
                    <p className="text-xs text-slate-400 mt-1">Mon-Fri, 8am - 6pm WAT</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Mail className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
                    <p className="text-muted-foreground text-sm">support@credican.cm</p>
                    <p className="text-xs text-slate-400 mt-1">Average response time: 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg overflow-hidden h-full">
              <CardContent className="p-8">
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div>
                      <Label className="text-base mb-4 block font-semibold text-slate-700">What do you need help with?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setTopic("credits")} className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${topic === 'credits' ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary' : 'bg-white hover:bg-slate-50 hover:border-slate-300'}`}>
                          <AlertCircle className="w-6 h-6" />
                          <span className="font-medium text-sm">Missing Credits</span>
                        </button>
                        <button type="button" onClick={() => setTopic("kiosk")} className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${topic === 'kiosk' ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary' : 'bg-white hover:bg-slate-50 hover:border-slate-300'}`}>
                          <MessageSquare className="w-6 h-6" />
                          <span className="font-medium text-sm">Kiosk Problem</span>
                        </button>
                        <button type="button" onClick={() => setTopic("rewards")} className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${topic === 'rewards' ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary' : 'bg-white hover:bg-slate-50 hover:border-slate-300'}`}>
                          <Gift className="w-6 h-6" />
                          <span className="font-medium text-sm">Reward Issue</span>
                        </button>
                        <button type="button" onClick={() => setTopic("other")} className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${topic === 'other' ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary' : 'bg-white hover:bg-slate-50 hover:border-slate-300'}`}>
                          <HelpCircle className="w-6 h-6" />
                          <span className="font-medium text-sm">General Question</span>
                        </button>
                      </div>
                    </div>

                    {topic && (
                      <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" placeholder="First Name" minLength={2} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" placeholder="Last Name" minLength={2} required />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            {/* The native browser HTML5 validation works perfectly here */}
                            <Input id="email" type="email" placeholder="email@example.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="flex shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-slate-100 text-muted-foreground font-medium sm:text-sm">
                                +237
                              </span>
                              <Input 
                                id="phone" 
                                type="tel" 
                                className={`rounded-l-none ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                                placeholder="6XX XXX XXX" 
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                maxLength={9} 
                                required 
                              />
                            </div>
                            {phoneError && (
                              <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message Details *</Label>
                          <Textarea id="message" placeholder={getTopicPlaceholder()} className="min-h-[120px] resize-y" minLength={10} required />
                        </div>

                        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                          Send Message <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in-95">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      Thank you for reaching out. A member of our support team will contact you shortly.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setIsSubmitted(false); 
                      setTopic(null);
                      setPhoneNumber("");
                      setPhoneError("");
                    }}>
                      Send another message
                    </Button>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;