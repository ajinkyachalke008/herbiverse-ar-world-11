import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import AddressSelector from "./AddressSelector";
import { professionOptions } from "@/data/maharashtraData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schemas
const mobileSchema = z.object({
  mobile: z.string()
    .regex(/^[6-9][0-9]{9}$/, "Please enter a valid 10-digit mobile number")
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits")
});

const profileSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  profession: z.string().min(1, "Please select your profession"),
  state: z.string().min(1, "Please select your state"),
  district: z.string().min(1, "Please select your district"),
  taluka: z.string().min(1, "Please select your taluka"),
  village: z.string().optional(),
  pinCode: z.string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code")
    .optional(),
  landmark: z.string().max(100, "Landmark must be less than 100 characters").optional(),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  newsletterConsent: z.boolean().optional()
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<'mobile' | 'profile'>('mobile');
  const [verifiedMobile, setVerifiedMobile] = useState("");

  // Form instances
  const mobileForm = useForm({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: "" }
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      profession: "",
      state: "",
      district: "",
      taluka: "",
      village: "",
      pinCode: "",
      landmark: "",
      termsAccepted: false,
      newsletterConsent: false
    }
  });

  const handleMobileSubmit = async (data: { mobile: string }) => {
    try {
      setVerifiedMobile(data.mobile);
      setCurrentStep('profile');
      toast.success("Mobile number confirmed!", {
        icon: <Leaf className="w-4 h-4 text-emerald-500" />
      });
    } catch (error) {
      toast.error("Failed to proceed. Please try again.");
    }
  };

  const handleCreateAccount = async (data: any) => {
    try {
      // Here you would call your account creation API
      toast.success("Account created successfully!");
      onSuccess();
      
      // Reset forms after success
      setTimeout(() => {
        mobileForm.reset();
        profileForm.reset();
        setCurrentStep('mobile');
        setVerifiedMobile("");
      }, 2000);
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    // Reset forms when closing
    setTimeout(() => {
      mobileForm.reset();
      profileForm.reset();
      setCurrentStep('mobile');
      setVerifiedMobile("");
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            {currentStep === 'mobile' && "Welcome to Herbiverse"}
            {currentStep === 'profile' && "Complete Your Profile"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            {['mobile', 'profile'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : index < ['mobile', 'profile'].indexOf(currentStep)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index < ['mobile', 'profile'].indexOf(currentStep) ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    index < ['mobile', 'profile'].indexOf(currentStep)
                      ? 'bg-emerald-500' 
                      : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Number Step */}
          {currentStep === 'mobile' && (
            <form onSubmit={mobileForm.handleSubmit(handleMobileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">+91</span>
                  </div>
                  <Input
                    id="mobile"
                    {...mobileForm.register("mobile")}
                    placeholder="Enter your mobile number"
                    className="pl-16 h-12 text-base"
                    maxLength={10}
                    autoFocus
                  />
                </div>
                {mobileForm.formState.errors.mobile && (
                  <p className="text-sm text-red-500">{mobileForm.formState.errors.mobile.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={mobileForm.formState.isSubmitting}
              >
                {mobileForm.formState.isSubmitting ? "Processing..." : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          {/* Profile Step */}
          {currentStep === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(handleCreateAccount)} className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ Mobile: +91 {verifiedMobile}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  {...profileForm.register("fullName")}
                  placeholder="Enter your full name"
                  className="h-11"
                />
                {profileForm.formState.errors.fullName && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">
                  Profession <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="profession"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your profession" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionOptions.map((profession) => (
                          <SelectItem key={profession} value={profession}>
                            {profession}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {profileForm.formState.errors.profession && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.profession.message}</p>
                )}
              </div>

              <AddressSelector form={profileForm} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="village">Village / Locality</Label>
                  <Input
                    id="village"
                    {...profileForm.register("village")}
                    placeholder="Enter village name"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode">PIN Code</Label>
                  <Input
                    id="pinCode"
                    {...profileForm.register("pinCode")}
                    placeholder="Enter PIN code"
                    maxLength={6}
                    className="h-11"
                  />
                  {profileForm.formState.errors.pinCode && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.pinCode.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  {...profileForm.register("landmark")}
                  placeholder="Nearby landmark"
                  className="h-11"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <Controller
                    name="termsAccepted"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    I agree to the{" "}
                    <a href="/terms" className="text-emerald-600 hover:underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-emerald-600 hover:underline">
                      Privacy Policy
                    </a>
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </div>
                {profileForm.formState.errors.termsAccepted && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.termsAccepted.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Controller
                    name="newsletterConsent"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Checkbox
                        id="newsletter"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    )}
                  />
                  <Label htmlFor="newsletter" className="text-sm leading-5">
                    Subscribe to our newsletter for herbal insights and updates
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={profileForm.formState.isSubmitting}
              >
                {profileForm.formState.isSubmitting ? "Creating Account..." : "Create My Account"}
                <Leaf className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;