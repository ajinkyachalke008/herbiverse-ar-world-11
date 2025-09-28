import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { indianStates, maharashtraData } from "@/data/maharashtraData";
import { MapPin, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AddressSelectorProps {
  form: UseFormReturn<any>;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ form }) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [talukas, setTalukas] = useState<string[]>([]);
  const [isManualTaluka, setIsManualTaluka] = useState(false);

  const watchedState = form.watch("state");
  const watchedDistrict = form.watch("district");

  useEffect(() => {
    if (watchedState !== selectedState) {
      setSelectedState(watchedState);
      setSelectedDistrict("");
      form.setValue("district", "");
      form.setValue("taluka", "");
      setIsManualTaluka(false);

      // Load districts for selected state
      if (watchedState === "Maharashtra") {
        setDistricts(Object.keys(maharashtraData));
      } else {
        // For other states, you would typically fetch from an API
        // For now, we'll show a placeholder
        setDistricts([]);
      }
      setTalukas([]);
    }
  }, [watchedState, selectedState, form]);

  useEffect(() => {
    if (watchedDistrict !== selectedDistrict) {
      setSelectedDistrict(watchedDistrict);
      form.setValue("taluka", "");
      setIsManualTaluka(false);

      // Load talukas for selected district
      if (watchedState === "Maharashtra" && watchedDistrict) {
        const districtTalukas = maharashtraData[watchedDistrict as keyof typeof maharashtraData];
        setTalukas(districtTalukas || []);
      } else {
        setTalukas([]);
      }
    }
  }, [watchedDistrict, selectedDistrict, watchedState, form]);

  const handleManualTaluka = () => {
    setIsManualTaluka(true);
    form.setValue("taluka", "");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-emerald-600" />
        <h3 className="text-sm font-medium text-foreground">Address Information</h3>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-3 h-3 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Taluka = local administrative division</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value="India"
          readOnly
          className="h-11 bg-muted cursor-not-allowed"
        />
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="state">
          State / Union Territory <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => form.setValue("state", value)}
          value={form.watch("state")}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {indianStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
                {state === "Maharashtra" && (
                  <span className="ml-2 text-xs text-emerald-600">(Full dataset)</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
          {form.formState.errors.state && (
            <p className="text-sm text-red-500">{String(form.formState.errors.state.message || "This field is required")}</p>
          )}
      </div>

      {/* District */}
      {selectedState && (
        <div className="space-y-2 animate-fade-in">
          <Label htmlFor="district">
            District <span className="text-red-500">*</span>
          </Label>
          {districts.length > 0 ? (
            <Select
              onValueChange={(value) => form.setValue("district", value)}
              value={form.watch("district")}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your district" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="district"
              {...form.register("district")}
              placeholder="Enter your district"
              className="h-11"
            />
          )}
          {form.formState.errors.district && (
            <p className="text-sm text-red-500">{String(form.formState.errors.district.message || "This field is required")}</p>
          )}
        </div>
      )}

      {/* Taluka */}
      {selectedDistrict && (
        <div className="space-y-2 animate-fade-in">
          <Label htmlFor="taluka">
            Taluka / Tehsil <span className="text-red-500">*</span>
          </Label>
          {!isManualTaluka && talukas.length > 0 ? (
            <>
              <Select
                onValueChange={(value) => form.setValue("taluka", value)}
                value={form.watch("taluka")}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your taluka" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {talukas.map((taluka) => (
                    <SelectItem key={taluka} value={taluka}>
                      {taluka}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={handleManualTaluka}
                className="text-xs text-emerald-600 hover:text-emerald-700 underline"
              >
                Not listed? Add manually
              </button>
            </>
          ) : (
            <Input
              id="taluka"
              {...form.register("taluka")}
              placeholder="Enter your taluka/tehsil"
              className="h-11"
            />
          )}
          {form.formState.errors.taluka && (
            <p className="text-sm text-red-500">{String(form.formState.errors.taluka.message || "This field is required")}</p>
          )}
        </div>
      )}

      {/* Maharashtra District Visualization */}
      {selectedState === "Maharashtra" && districts.length > 0 && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Maharashtra - {districts.length} Districts Available
            </span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-500">
            Complete dataset with all talukas for instant selection
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;