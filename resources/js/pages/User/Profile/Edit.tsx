import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Upload, Save, ChevronRight, ChevronLeft, MapPin, Briefcase, Link, Shield, Phone, Calendar, UserCheck } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';

interface Country {
    id: number;
    name: string;
    code: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User;
    };
}

interface UserProfile {
    id?: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country_id?: number;
    organization?: string;
    job_title?: string;
    bio?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    orcid?: string;
    google_scholar?: string;
    researchgate?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    nationality?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    dietary_restrictions?: string;
    accessibility_needs?: string;
    is_public: boolean;
    avatar?: string;
}

interface EditProfileProps extends PageProps {
    profile?: UserProfile;
    countries: Country[];
}

// Simple Progress component
const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
        <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${value}%` }}
        />
    </div>
);

export default function EditProfile({ auth, profile, countries }: EditProfileProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    
    const steps = [
        { id: 1, title: 'Basic Info', icon: User, description: 'Personal information' },
        { id: 2, title: 'Address', icon: MapPin, description: 'Location details' },
        { id: 3, title: 'Professional', icon: Briefcase, description: 'Work & organization' },
        { id: 4, title: 'Academic Links', icon: Link, description: 'Social & research profiles' },
        { id: 5, title: 'Additional Info', icon: Shield, description: 'Emergency & preferences' }
    ];
    
    const { data, setData, post, processing, errors } = useForm({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        postal_code: profile?.postal_code || '',
        country_id: profile?.country_id?.toString() || '',
        organization: profile?.organization || '',
        job_title: profile?.job_title || '',
        bio: profile?.bio || '',
        website: profile?.website || '',
        linkedin: profile?.linkedin || '',
        twitter: profile?.twitter || '',
        orcid: profile?.orcid || '',
        google_scholar: profile?.google_scholar || '',
        researchgate: profile?.researchgate || '',
        date_of_birth: profile?.date_of_birth || '',
        gender: profile?.gender || '',
        nationality: profile?.nationality || '',
        emergency_contact_name: profile?.emergency_contact_name || '',
        emergency_contact_phone: profile?.emergency_contact_phone || '',
        dietary_restrictions: profile?.dietary_restrictions || '',
        accessibility_needs: profile?.accessibility_needs || '',
        is_public: profile?.is_public || false,
        avatar: null as File | null,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.profile.update'));
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return data.first_name && data.last_name;
            case 2:
                return data.city && data.country_id;
            case 3:
                return data.organization;
            case 4:
                return true; // Optional step
            case 5:
                return true; // Optional step
            default:
                return false;
        }
    };

    const getStepProgress = () => {
        return (currentStep / totalSteps) * 100;
    };

    return (
        <UserLayout title={profile ? 'Edit Profile' : 'Complete Your Profile'}>
            <Head title={profile ? 'Edit Profile' : 'Complete Profile'} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 mr-2" })}
                                    {steps[currentStep - 1].title}
                                </div>
                                <span className="text-sm text-gray-500">
                                    Step {currentStep} of {totalSteps}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {steps[currentStep - 1].description}
                            </CardDescription>
                            
                            {/* Progress Bar */}
                            <div className="mt-4">
                                <Progress value={getStepProgress()} className="w-full" />
                                <div className="flex justify-between mt-2">
                                    {steps.map((step) => (
                                        <div
                                            key={step.id}
                                            className={`flex flex-col items-center ${
                                                step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                            }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                                    step.id < currentStep
                                                        ? 'bg-blue-600 text-white'
                                                        : step.id === currentStep
                                                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                                                        : 'bg-gray-200 text-gray-400'
                                                }`}
                                            >
                                                {step.id < currentStep ? '✓' : step.id}
                                            </div>
                                            <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Step 1: Basic Information */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        {/* Avatar Section */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">Profile Picture</h3>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {avatarPreview ? (
                                                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                                    ) : profile?.avatar ? (
                                                        <img src={`/storage/${profile.avatar}`} alt="Current avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="avatar" className="cursor-pointer">
                                                        <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                                            <Upload className="h-4 w-4" />
                                                            <span>Upload Photo</span>
                                                        </div>
                                                    </Label>
                                                    <Input
                                                        id="avatar"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleAvatarChange}
                                                        className="hidden"
                                                    />
                                                    <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                                                </div>
                                            </div>
                                            {errors.avatar && (
                                                <p className="text-sm text-red-600">{errors.avatar}</p>
                                            )}
                                                 </div>

                                         {/* Basic Information */}
                                         <div className="space-y-4">
                                             <h3 className="text-lg font-medium">Personal Information</h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div>
                                                     <Label htmlFor="first_name">First Name *</Label>
                                                     <Input
                                                         id="first_name"
                                                         type="text"
                                                         value={data.first_name}
                                                         onChange={(e) => setData('first_name', e.target.value)}
                                                         className={errors.first_name ? 'border-red-500' : ''}
                                                         placeholder="Enter your first name"
                                                     />
                                                     {errors.first_name && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="last_name">Last Name *</Label>
                                                     <Input
                                                         id="last_name"
                                                         type="text"
                                                         value={data.last_name}
                                                         onChange={(e) => setData('last_name', e.target.value)}
                                                         className={errors.last_name ? 'border-red-500' : ''}
                                                         placeholder="Enter your last name"
                                                     />
                                                     {errors.last_name && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="date_of_birth">Date of Birth</Label>
                                                     <Input
                                                         id="date_of_birth"
                                                         type="date"
                                                         value={data.date_of_birth}
                                                         onChange={(e) => setData('date_of_birth', e.target.value)}
                                                         className={errors.date_of_birth ? 'border-red-500' : ''}
                                                     />
                                                     {errors.date_of_birth && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.date_of_birth}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="gender">Gender</Label>
                                                     <Select
                                                         value={data.gender}
                                                         onValueChange={(value) => setData('gender', value)}
                                                     >
                                                         <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                                             <SelectValue placeholder="Select gender" />
                                                         </SelectTrigger>
                                                         <SelectContent>
                                                             <SelectItem value="male">Male</SelectItem>
                                                             <SelectItem value="female">Female</SelectItem>
                                                             <SelectItem value="other">Other</SelectItem>
                                                             <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                                         </SelectContent>
                                                     </Select>
                                                     {errors.gender && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="phone">Phone Number</Label>
                                                     <Input
                                                         id="phone"
                                                         type="tel"
                                                         value={data.phone}
                                                         onChange={(e) => setData('phone', e.target.value)}
                                                         className={errors.phone ? 'border-red-500' : ''}
                                                         placeholder="+62 812 3456 7890"
                                                     />
                                                     {errors.phone && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="nationality">Nationality</Label>
                                                     <Input
                                                         id="nationality"
                                                         type="text"
                                                         value={data.nationality}
                                                         onChange={(e) => setData('nationality', e.target.value)}
                                                         className={errors.nationality ? 'border-red-500' : ''}
                                                         placeholder="Indonesian"
                                                     />
                                                     {errors.nationality && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.nationality}</p>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 )}

                                 {/* Step 2: Address Information */}
                                 {currentStep === 2 && (
                                     <div className="space-y-6">
                                         <div className="space-y-4">
                                             <h3 className="text-lg font-medium">Address Information</h3>
                                             <div className="grid grid-cols-1 gap-4">
                                                 <div>
                                                     <Label htmlFor="address">Street Address</Label>
                                                     <Textarea
                                                         id="address"
                                                         value={data.address}
                                                         onChange={(e) => setData('address', e.target.value)}
                                                         className={errors.address ? 'border-red-500' : ''}
                                                         placeholder="Enter your full address"
                                                         rows={3}
                                                     />
                                                     {errors.address && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                                                     )}
                                                 </div>

                                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                     <div>
                                                         <Label htmlFor="city">City *</Label>
                                                         <Input
                                                             id="city"
                                                             type="text"
                                                             value={data.city}
                                                             onChange={(e) => setData('city', e.target.value)}
                                                             className={errors.city ? 'border-red-500' : ''}
                                                             placeholder="City"
                                                         />
                                                         {errors.city && (
                                                             <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                                                         )}
                                                     </div>

                                                     <div>
                                                         <Label htmlFor="state">State/Province</Label>
                                                         <Input
                                                             id="state"
                                                             type="text"
                                                             value={data.state}
                                                             onChange={(e) => setData('state', e.target.value)}
                                                             className={errors.state ? 'border-red-500' : ''}
                                                             placeholder="State/Province"
                                                         />
                                                         {errors.state && (
                                                             <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                                                         )}
                                                     </div>

                                                     <div>
                                                         <Label htmlFor="postal_code">Postal Code</Label>
                                                         <Input
                                                             id="postal_code"
                                                             type="text"
                                                             value={data.postal_code}
                                                             onChange={(e) => setData('postal_code', e.target.value)}
                                                             className={errors.postal_code ? 'border-red-500' : ''}
                                                             placeholder="12345"
                                                         />
                                                         {errors.postal_code && (
                                                             <p className="text-sm text-red-600 mt-1">{errors.postal_code}</p>
                                                         )}
                                                     </div>
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="country_id">Country *</Label>
                                                     <Select
                                                         value={data.country_id}
                                                         onValueChange={(value) => setData('country_id', value)}
                                                     >
                                                         <SelectTrigger className={errors.country_id ? 'border-red-500' : ''}>
                                                             <SelectValue placeholder="Select your country" />
                                                         </SelectTrigger>
                                                         <SelectContent>
                                                             {countries.map((country) => (
                                                                 <SelectItem key={country.id} value={country.id.toString()}>
                                                                     {country.name}
                                                                 </SelectItem>
                                                             ))}
                                                         </SelectContent>
                                                     </Select>
                                                     {errors.country_id && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.country_id}</p>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 )}

                                 {/* Step 3: Professional Information */}
                                 {currentStep === 3 && (
                                     <div className="space-y-6">
                                         <div className="space-y-4">
                                             <h3 className="text-lg font-medium">Professional Information</h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div>
                                                     <Label htmlFor="organization">Organization/Institution *</Label>
                                                     <Input
                                                         id="organization"
                                                         type="text"
                                                         value={data.organization}
                                                         onChange={(e) => setData('organization', e.target.value)}
                                                         className={errors.organization ? 'border-red-500' : ''}
                                                         placeholder="University/Company name"
                                                     />
                                                     {errors.organization && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.organization}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="job_title">Job Title/Position</Label>
                                                     <Input
                                                         id="job_title"
                                                         type="text"
                                                         value={data.job_title}
                                                         onChange={(e) => setData('job_title', e.target.value)}
                                                         className={errors.job_title ? 'border-red-500' : ''}
                                                         placeholder="Professor, Researcher, Student, etc."
                                                     />
                                                     {errors.job_title && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.job_title}</p>
                                                     )}
                                                 </div>
                                             </div>

                                             <div>
                                                 <Label htmlFor="bio">Biography</Label>
                                                 <Textarea
                                                     id="bio"
                                                     value={data.bio}
                                                     onChange={(e) => setData('bio', e.target.value)}
                                                     className={errors.bio ? 'border-red-500' : ''}
                                                     placeholder="Brief description about yourself and your research interests"
                                                     rows={4}
                                                 />
                                                 {errors.bio && (
                                                     <p className="text-sm text-red-600 mt-1">{errors.bio}</p>
                                                 )}
                                             </div>
                                         </div>
                                     </div>
                                 )}

                                 {/* Step 4: Academic & Social Links */}
                                 {currentStep === 4 && (
                                     <div className="space-y-6">
                                         <div className="space-y-4">
                                             <h3 className="text-lg font-medium">Academic & Social Links</h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div>
                                                     <Label htmlFor="website">Personal Website</Label>
                                                     <Input
                                                         id="website"
                                                         type="url"
                                                         value={data.website}
                                                         onChange={(e) => setData('website', e.target.value)}
                                                         className={errors.website ? 'border-red-500' : ''}
                                                         placeholder="https://yourwebsite.com"
                                                     />
                                                     {errors.website && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.website}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                                     <Input
                                                         id="linkedin"
                                                         type="url"
                                                         value={data.linkedin}
                                                         onChange={(e) => setData('linkedin', e.target.value)}
                                                         className={errors.linkedin ? 'border-red-500' : ''}
                                                         placeholder="https://linkedin.com/in/yourprofile"
                                                     />
                                                     {errors.linkedin && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.linkedin}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="orcid">ORCID ID</Label>
                                                     <Input
                                                         id="orcid"
                                                         type="text"
                                                         value={data.orcid}
                                                         onChange={(e) => setData('orcid', e.target.value)}
                                                         className={errors.orcid ? 'border-red-500' : ''}
                                                         placeholder="0000-0000-0000-0000"
                                                     />
                                                     {errors.orcid && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.orcid}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="google_scholar">Google Scholar Profile</Label>
                                                     <Input
                                                         id="google_scholar"
                                                         type="url"
                                                         value={data.google_scholar}
                                                         onChange={(e) => setData('google_scholar', e.target.value)}
                                                         className={errors.google_scholar ? 'border-red-500' : ''}
                                                         placeholder="https://scholar.google.com/citations?user=..."
                                                     />
                                                     {errors.google_scholar && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.google_scholar}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="researchgate">ResearchGate Profile</Label>
                                                     <Input
                                                         id="researchgate"
                                                         type="url"
                                                         value={data.researchgate}
                                                         onChange={(e) => setData('researchgate', e.target.value)}
                                                         className={errors.researchgate ? 'border-red-500' : ''}
                                                         placeholder="https://www.researchgate.net/profile/..."
                                                     />
                                                     {errors.researchgate && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.researchgate}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="twitter">Twitter/X Profile</Label>
                                                     <Input
                                                         id="twitter"
                                                         type="url"
                                                         value={data.twitter}
                                                         onChange={(e) => setData('twitter', e.target.value)}
                                                         className={errors.twitter ? 'border-red-500' : ''}
                                                         placeholder="https://twitter.com/yourusername"
                                                     />
                                                     {errors.twitter && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.twitter}</p>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 )}

                                 {/* Step 5: Additional Information */}
                                 {currentStep === 5 && (
                                     <div className="space-y-6">
                                         <div className="space-y-4">
                                             <h3 className="text-lg font-medium">Emergency Contact</h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div>
                                                     <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                                                     <Input
                                                         id="emergency_contact_name"
                                                         type="text"
                                                         value={data.emergency_contact_name}
                                                         onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                         className={errors.emergency_contact_name ? 'border-red-500' : ''}
                                                         placeholder="Full name of emergency contact"
                                                     />
                                                     {errors.emergency_contact_name && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_name}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                                                     <Input
                                                         id="emergency_contact_phone"
                                                         type="tel"
                                                         value={data.emergency_contact_phone}
                                                         onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                                         className={errors.emergency_contact_phone ? 'border-red-500' : ''}
                                                         placeholder="+62 812 3456 7890"
                                                     />
                                                     {errors.emergency_contact_phone && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_phone}</p>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>

                                         <div className="space-y-4">
                                             <h3 className="text-lg font-medium">Special Requirements</h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <div>
                                                     <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                                                     <Textarea
                                                         id="dietary_restrictions"
                                                         value={data.dietary_restrictions}
                                                         onChange={(e) => setData('dietary_restrictions', e.target.value)}
                                                         className={errors.dietary_restrictions ? 'border-red-500' : ''}
                                                         placeholder="Any dietary restrictions or food allergies"
                                                         rows={3}
                                                     />
                                                     {errors.dietary_restrictions && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.dietary_restrictions}</p>
                                                     )}
                                                 </div>

                                                 <div>
                                                     <Label htmlFor="accessibility_needs">Accessibility Needs</Label>
                                                     <Textarea
                                                         id="accessibility_needs"
                                                         value={data.accessibility_needs}
                                                         onChange={(e) => setData('accessibility_needs', e.target.value)}
                                                         className={errors.accessibility_needs ? 'border-red-500' : ''}
                                                         placeholder="Any accessibility requirements or accommodations needed"
                                                         rows={3}
                                                     />
                                                     {errors.accessibility_needs && (
                                                         <p className="text-sm text-red-600 mt-1">{errors.accessibility_needs}</p>
                                                     )}
                                                 </div>
                                             </div>
                                         </div>

                                         <div className="space-y-4">
                                             <h3 className="text-lg font-medium">Privacy Settings</h3>
                                             <div className="flex items-center space-x-2">
                                                 <input
                                                     type="checkbox"
                                                     id="is_public"
                                                     checked={data.is_public}
                                                     onChange={(e) => setData('is_public', e.target.checked)}
                                                     className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                 />
                                                 <Label htmlFor="is_public" className="text-sm">
                                                     Make my profile public (visible to other conference participants)
                                                 </Label>
                                             </div>
                                             {errors.is_public && (
                                                 <p className="text-sm text-red-600">{errors.is_public}</p>
                                             )}
                                         </div>
                                     </div>
                                 )}

                                 {/* Navigation Buttons */}
                                 <div className="flex justify-between pt-6 border-t">
                                     <div>
                                         {currentStep > 1 && (
                                             <Button
                                                 type="button"
                                                 variant="outline"
                                                 onClick={prevStep}
                                                 className="flex items-center"
                                             >
                                                 <ChevronLeft className="h-4 w-4 mr-2" />
                                                 Previous
                                             </Button>
                                         )}
                                     </div>
                                     <div className="flex space-x-4">
                                         {currentStep < totalSteps ? (
                                             <Button
                                                 type="button"
                                                 onClick={nextStep}
                                                 disabled={!isStepValid(currentStep)}
                                                 className="flex items-center"
                                             >
                                                 Next
                                                 <ChevronRight className="h-4 w-4 ml-2" />
                                             </Button>
                                         ) : (
                                             <>
                                                 <Button
                                                     type="button"
                                                     variant="outline"
                                                     onClick={() => window.history.back()}
                                                 >
                                                     Cancel
                                                 </Button>
                                                 <Button type="submit" disabled={processing} className="flex items-center">
                                                     <Save className="h-4 w-4 mr-2" />
                                                     {processing ? 'Saving...' : (profile ? 'Update Profile' : 'Save Profile')}
                                                 </Button>
                                             </>
                                         )}
                                     </div>
                                 </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}