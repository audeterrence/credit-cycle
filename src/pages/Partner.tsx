import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User, Target, TrendingUp, Users, Leaf, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Partner = () => {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<string>("");
  
  // Validation States
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [primaryGoal, setPrimaryGoal] = useState<string>("");
  const [goalError, setGoalError] = useState("");

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  // Move between steps with validation
  const nextStep = () => {
    if (step === 2) {
      let hasError = false;

      // Phone Validation
      if (phoneNumber.length < 9) {
        setPhoneError("Phone number must be exactly 9 digits.");
        hasError = true;
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.length > 0 && !emailRegex.test(email)) {
        setEmailError("Please enter a valid email address (e.g., name@example.com).");
        hasError = true;
      }

      if (hasError) return; // Block moving to step 3
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Controlled submission handler to bypass native HTML5 required bugs
  const handleFinalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!primaryGoal) {
      setGoalError("Please select a primary goal to continue.");
      return;
    }
    
    setGoalError("");
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      
      <div className="bg-primary/10 py-12 border-b">
        <div className="container text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            Grow Your Business with Credi-Can
          </h1>
          <p className="text-lg text-muted-foreground">
            Join the premier recycling rewards network in Cameroon. Turn eco-conscious citizens into your loyal customers.
          </p>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border shadow-sm h-full">
              <h3 className="text-2xl font-bold mb-6">Why Partner With Us?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl h-fit">
                    <TrendingUp className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Guaranteed Sales</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Users redeem their hard-earned recycling credits directly at your business, bringing guaranteed revenue to your doorstep.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl h-fit">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">New Foot Traffic</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Get discovered by thousands of active recyclers in your city through our interactive map and rewards directory.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl h-fit">
                    <Leaf className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Green Brand Image</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Show your community that you care about a cleaner Cameroon. We provide you with official "Credi-Can Eco-Partner" branding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg overflow-hidden h-full">
              
              {!isSubmitted && (
                <div className="bg-slate-100 flex justify-between p-4 px-8 border-b relative">
                  <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500 ease-in-out" style={{ width: `${(step / 3) * 100}%` }} />
                  <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <Building2 className="h-5 w-5" /> <span className="hidden sm:inline">Business</span>
                  </div>
                  <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <User className="h-5 w-5" /> <span className="hidden sm:inline">Contact</span>
                  </div>
                  <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <Target className="h-5 w-5" /> <span className="hidden sm:inline">Intent</span>
                  </div>
                </div>
              )}

              <CardContent className={isSubmitted ? "p-0 h-full" : "p-8"}>
                
                {!isSubmitted ? (
                  <form>
                    
                    {/* STEP 1: Business Details */}
                    <div className={step === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                      <h3 className="text-xl font-bold mb-6">Tell us about your business</h3>
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label>Business Name *</Label>
                          <Input placeholder="e.g. Boulangerie Saker" />
                        </div>
                        <div className="space-y-2">
                          <Label>Business Category *</Label>
                          <Select onValueChange={setBusinessType}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bakery">Bakery / Pastry</SelectItem>
                              <SelectItem value="supermarket">Supermarket / Grocery</SelectItem>
                              <SelectItem value="mobile_money">Mobile Money Agent</SelectItem>
                              <SelectItem value="pharmacy">Pharmacy</SelectItem>
                              <SelectItem value="restaurant">Restaurant / Café</SelectItem>
                              <SelectItem value="transport">Transport Syndicate</SelectItem>
                              <SelectItem value="education">School / Stationeries</SelectItem>
                              <SelectItem value="other">Other (Please specify)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {businessType === "other" && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>Please specify your business type *</Label>
                            <Input placeholder="What kind of business do you run?" />
                          </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>City *</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="douala">Douala</SelectItem>
                                <SelectItem value="yaounde">Yaoundé</SelectItem>
                                <SelectItem value="bafoussam">Bafoussam</SelectItem>
                                <SelectItem value="bamenda">Bamenda</SelectItem>
                                <SelectItem value="garoua">Garoua</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Neighborhood (Quartier) *</Label>
                            <Input placeholder="e.g. Bonamoussadi" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STEP 2: Contact Person */}
                    <div className={step === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                      <h3 className="text-xl font-bold mb-6">Who should we contact?</h3>
                      <div className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>First Name *</Label>
                            <Input placeholder="First Name" />
                          </div>
                          <div className="space-y-2">
                            <Label>Last Name *</Label>
                            <Input placeholder="Last Name" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Sex *</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="Select sex" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input 
                              type="email" 
                              placeholder="email@example.com" 
                              value={email}
                              onChange={handleEmailChange}
                              className={emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {emailError && (
                              <p className="text-sm text-red-500 mt-1">{emailError}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Business Phone Number *</Label>
                          <div className="flex shadow-sm">
                            <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-input bg-slate-100 text-muted-foreground font-semibold">
                              +237
                            </span>
                            <Input 
                              type="tel" 
                              className={`rounded-l-none ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                              placeholder="6XX XXX XXX" 
                              value={phoneNumber}
                              onChange={handlePhoneChange}
                              maxLength={9} 
                            />
                          </div>
                          {phoneError && (
                            <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* STEP 3: Intent */}
                    <div className={step === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                      <h3 className="text-xl font-bold mb-6">How can we help you?</h3>
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label>Primary goal for partnering? *</Label>
                          <Select onValueChange={(val) => { setPrimaryGoal(val); setGoalError(""); }}>
                            <SelectTrigger className={goalError ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                              <SelectValue placeholder="Select primary goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="foot_traffic">Increase physical foot traffic</SelectItem>
                              <SelectItem value="sales">Increase overall sales volume</SelectItem>
                              <SelectItem value="csr">Corporate Social Responsibility</SelectItem>
                              <SelectItem value="new_customers">Acquire new customers</SelectItem>
                            </SelectContent>
                          </Select>
                          {goalError && (
                            <p className="text-sm text-red-500 mt-1">{goalError}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Additional Information</Label>
                          <Textarea placeholder="Tell us a bit more about your business expectations..." className="min-h-[120px]" />
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-10 pt-6 border-t">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep} 
                        disabled={step === 1}
                        className={step === 1 ? 'opacity-0 pointer-events-none' : ''}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>

                      {step < 3 ? (
                        <Button type="button" onClick={nextStep} size="lg">
                          Continue <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button type="button" onClick={handleFinalSubmit} size="lg" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Application
                        </Button>
                      )}
                    </div>

                  </form>
                ) : (
                  
                  <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95">
                    <div className="bg-green-100 p-5 rounded-full mb-6">
                      <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3">Application Submitted!</h3>
                    <p className="text-muted-foreground text-lg max-w-md mb-8">
                      Thank you for your interest in joining the Credi-Can network. Our B2B team will review your details and contact you within 48 hours.
                    </p>
                    <Button variant="outline" size="lg" onClick={() => {
                      setIsSubmitted(false);
                      setStep(1);
                      setPhoneNumber("");
                      setPhoneError("");
                      setEmail("");
                      setEmailError("");
                      setBusinessType("");
                      setPrimaryGoal("");
                    }}>
                      Submit another business
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

export default Partner;