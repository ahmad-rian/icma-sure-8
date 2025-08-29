import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, FileText, ArrowLeft } from 'lucide-react';
import TinyMCEEditor from '@/components/ui/tinymce-editor';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


interface Author {
    first_name: string;
    last_name: string;
    email: string;
    affiliation: string;
    country_id: string;
    is_primary_contact: boolean;
}

interface Contributor {
    first_name: string;
    last_name: string;
    email: string;
    affiliation: string;
    country_id: string;
    role: 'co-author' | 'contributor';
    is_primary_contact: boolean;
}

interface Country {
    id: string | number;
    name: string;
}

interface CreateProps {
    auth: {
        user: {
            id: string | number;
            name: string;
            email: string;
        };
    };
    countries: Country[];
}

interface SubmissionFormData {
    title: string;
    abstract: string;
    keywords: string;
    author: Author;
    contributors: Contributor[];
    [key: string]: any;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
};

export default function Create({ auth, countries }: CreateProps) {
    // Split user name into first and last name
    const userName = auth.user?.name || '';
    const nameParts = userName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const { data, setData, post, processing, errors } = useForm<SubmissionFormData>({
        title: '',
        abstract: '',
        keywords: '',
        author: {
            first_name: firstName,
            last_name: lastName,
            email: auth.user?.email || '',
            affiliation: '',
            country_id: '',
            is_primary_contact: true,
        },
        contributors: [],
    });

    const addContributor = () => {
        const newContributors = [
            ...data.contributors,
            {
                first_name: '',
                last_name: '',
                email: '',
                affiliation: '',
                country_id: '',
                role: 'co-author' as const,
                is_primary_contact: false,
            },
        ];
        setData('contributors', newContributors);
    };

    const removeContributor = (index: number) => {
        const newContributors = data.contributors.filter((_, i) => i !== index);
        setData('contributors', newContributors);
    };

    const updateAuthor = (field: keyof Author, value: any) => {
        setData('author', { ...data.author, [field]: value });
    };

    const updateContributor = (index: number, field: keyof Contributor, value: any) => {
        const newContributors = [...data.contributors];
        newContributors[index] = { ...newContributors[index], [field]: value };
        setData('contributors', newContributors);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.submissions.store'));
    };

    return (
        <>
            <Head title="Submit Abstract" />
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <Navbar />
                
                <div className="relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-900">
                        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#4CB050]/10 to-transparent"></div>
                        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-bl from-[#E52531]/10 to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#4CB050]/5 via-[#2a3b8f]/5 to-[#F0A023]/5"></div>
                        
                        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={colors.green} />
                                    <stop offset="50%" stopColor={colors.orange} />
                                    <stop offset="100%" stopColor={colors.red} />
                                </linearGradient>
                            </defs>
                            <circle cx="200" cy="200" r="150" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.3" />
                            <circle cx="800" cy="300" r="100" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.2" />
                            <circle cx="600" cy="700" r="120" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.25" />
                            <polygon points="500,100 700,300 500,500 300,300" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.2" />
                        </svg>
                    </div>

                    {/* Header Section */}
                    <div className="relative z-10">
                        <motion.div 
                            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.div 
                                className="text-center mb-12"
                                variants={itemVariants}
                            >
                                <motion.div 
                                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#4CB050] to-[#F0A023] shadow-2xl mb-6 sm:mb-8"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </motion.div>
                                
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Submit New{' '}
                                    <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                                        Abstract
                                    </span>
                                </h1>
                                
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                                    Submit your abstract for the 8th International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA-SURE) 2025
                                </p>

                                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] mb-6 sm:mb-8"></div>

                                {/* Back Button */}
                                <Link
                                    href={route('user.submissions.index')}
                                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Submissions
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                            >
                                <div className="h-2 bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
                                
                                <div className="p-6 sm:p-8 lg:p-12">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Basic Information */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3 mb-6">
                                                <div className="w-8 h-8 bg-gradient-to-br from-[#4CB050] to-[#F0A023] rounded-xl flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Basic Information</h3>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Abstract Title *</Label>
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                    placeholder="Enter your abstract title"
                                                />
                                                {errors.title && (
                                                    <p className="text-sm text-red-600 mt-1 flex items-center">
                                                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                                        {errors.title}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="keywords" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Keywords</Label>
                                                <Input
                                                    id="keywords"
                                                    type="text"
                                                    value={data.keywords}
                                                    onChange={(e) => setData('keywords', e.target.value)}
                                                    className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors.keywords ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                    placeholder="Enter keywords separated by commas"
                                                />
                                                {errors.keywords && (
                                                    <p className="text-sm text-red-600 mt-1 flex items-center">
                                                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                                        {errors.keywords}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="abstract" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Abstract Content *</Label>
                                                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden">
                                                    <TinyMCEEditor
                                                        value={data.abstract}
                                                        onChange={(content: string) => setData('abstract', content)}
                                                        placeholder="Enter your abstract content here..."
                                                    />
                                                </div>
                                                {errors.abstract && (
                                                    <p className="text-sm text-red-600 mt-1 flex items-center">
                                                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                                        {errors.abstract}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Author Information */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3 mb-6">
                                                <div className="w-8 h-8 bg-gradient-to-br from-[#2a3b8f] to-[#4CB050] rounded-xl flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Author Information</h3>
                                            </div>
                                            
                                            <div className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-600/50">
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Primary Author (You)</h4>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="author-first-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name *</Label>
                                                        <Input
                                                            id="author-first-name"
                                                            type="text"
                                                            value={data.author.first_name}
                                                            onChange={(e) => updateAuthor('first_name', e.target.value)}
                                                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors['author.first_name'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                        />
                                                        {errors['author.first_name'] && (
                                                            <p className="text-sm text-red-600 mt-1">
                                                                {errors['author.first_name']}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="author-last-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name *</Label>
                                                        <Input
                                                            id="author-last-name"
                                                            type="text"
                                                            value={data.author.last_name}
                                                            onChange={(e) => updateAuthor('last_name', e.target.value)}
                                                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors['author.last_name'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                        />
                                                        {errors['author.last_name'] && (
                                                            <p className="text-sm text-red-600 mt-1">
                                                                {errors['author.last_name']}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="author-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email *</Label>
                                                        <Input
                                                            id="author-email"
                                                            type="email"
                                                            value={data.author.email}
                                                            onChange={(e) => updateAuthor('email', e.target.value)}
                                                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors['author.email'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                            disabled
                                                        />
                                                        {errors['author.email'] && (
                                                            <p className="text-sm text-red-600 mt-1">
                                                                {errors['author.email']}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="author-affiliation" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Affiliation *</Label>
                                                        <Input
                                                            id="author-affiliation"
                                                            type="text"
                                                            value={data.author.affiliation}
                                                            onChange={(e) => updateAuthor('affiliation', e.target.value)}
                                                            className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors['author.affiliation'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                            placeholder="Informatika, Teknik, Unsoed, Indonesia"
                                                        />
                                                        {errors['author.affiliation'] && (
                                                            <p className="text-sm text-red-600 mt-1">
                                                                {errors['author.affiliation']}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="author-country" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Country *</Label>
                                                        <Select
                                                            value={data.author.country_id}
                                                            onValueChange={(value) => updateAuthor('country_id', value)}
                                                        >
                                                            <SelectTrigger id="author-country" className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors['author.country_id'] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}>
                                                                <SelectValue placeholder="Select country" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {countries.map((country) => (
                                                                    <SelectItem key={country.id} value={country.id.toString()}>
                                                                        {country.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors['author.country_id'] && (
                                                            <p className="text-sm text-red-600 mt-1">
                                                                {errors['author.country_id']}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contributors */}
                                        <div className="space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-[#F0A023] to-[#E52531] rounded-xl flex items-center justify-center">
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </div>
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Contributors (Optional)</h3>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={addContributor}
                                                    className="bg-gradient-to-r from-[#4CB050] to-[#F0A023] hover:from-[#4CB050] hover:to-[#E52531] text-white rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 self-start sm:self-auto"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Contributor
                                                </Button>
                                            </div>

                                            {data.contributors.map((contributor, index) => {
                                                return (
                                                    <div key={index} className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-600/50">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                                                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                                                Contributor {index + 1}
                                                            </h4>
                                                            <Button
                                                                type="button"
                                                                onClick={() => removeContributor(index)}
                                                                className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 transition-all duration-200 self-start sm:self-auto"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`contributor-${index}-first-name`} className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name *</Label>
                                                                <Input
                                                                    id={`contributor-${index}-first-name`}
                                                                    type="text"
                                                                    value={contributor.first_name}
                                                                    onChange={(e) => updateContributor(index, 'first_name', e.target.value)}
                                                                    className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors[`contributors.${index}.first_name` as keyof typeof errors] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                                />
                                                                {errors[`contributors.${index}.first_name` as keyof typeof errors] && (
                                                                    <p className="text-sm text-red-600 mt-1">
                                                                        {errors[`contributors.${index}.first_name` as keyof typeof errors]}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor={`contributor-${index}-last-name`} className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name *</Label>
                                                                <Input
                                                                    id={`contributor-${index}-last-name`}
                                                                    type="text"
                                                                    value={contributor.last_name}
                                                                    onChange={(e) => updateContributor(index, 'last_name', e.target.value)}
                                                                    className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors[`contributors.${index}.last_name` as keyof typeof errors] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                                />
                                                                {errors[`contributors.${index}.last_name` as keyof typeof errors] && (
                                                                    <p className="text-sm text-red-600 mt-1">
                                                                        {errors[`contributors.${index}.last_name` as keyof typeof errors]}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor={`contributor-${index}-email`} className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email *</Label>
                                                                <Input
                                                                    id={`contributor-${index}-email`}
                                                                    type="email"
                                                                    value={contributor.email}
                                                                    onChange={(e) => updateContributor(index, 'email', e.target.value)}
                                                                    className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors[`contributors.${index}.email` as keyof typeof errors] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                                />
                                                                {errors[`contributors.${index}.email` as keyof typeof errors] && (
                                                                    <p className="text-sm text-red-600 mt-1">
                                                                        {errors[`contributors.${index}.email` as keyof typeof errors]}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor={`contributor-${index}-affiliation`} className="text-sm font-semibold text-gray-700 dark:text-gray-300">Affiliation *</Label>
                                                                <Input
                                                                    id={`contributor-${index}-affiliation`}
                                                                    type="text"
                                                                    value={contributor.affiliation}
                                                                    onChange={(e) => updateContributor(index, 'affiliation', e.target.value)}
                                                                    className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors[`contributors.${index}.affiliation` as keyof typeof errors] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                                    placeholder="University/Institution"
                                                                />
                                                                {errors[`contributors.${index}.affiliation` as keyof typeof errors] && (
                                                                    <p className="text-sm text-red-600 mt-1">
                                                                        {errors[`contributors.${index}.affiliation` as keyof typeof errors]}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor={`contributor-${index}-country`} className="text-sm font-semibold text-gray-700 dark:text-gray-300">Country *</Label>
                                                                <Select
                                                                    value={contributor.country_id}
                                                                    onValueChange={(value) => updateContributor(index, 'country_id', value)}
                                                                >
                                                                    <SelectTrigger id={`contributor-${index}-country`} className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors[`contributors.${index}.country_id` as keyof typeof errors] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}>
                                                                        <SelectValue placeholder="Select country" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {countries.map((country) => (
                                                                            <SelectItem key={country.id} value={country.id.toString()}>
                                                                                {country.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors[`contributors.${index}.country_id` as keyof typeof errors] && (
                                                                    <p className="text-sm text-red-600 mt-1">
                                                                        {errors[`contributors.${index}.country_id` as keyof typeof errors]}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor={`contributor-${index}-role`} className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role *</Label>
                                                                <Select
                                                                    value={contributor.role}
                                                                    onValueChange={(value) => updateContributor(index, 'role', value as Contributor['role'])}
                                                                >
                                                                    <SelectTrigger id={`contributor-${index}-role`} className={`h-12 rounded-xl border-2 transition-all duration-200 ${errors[`contributors.${index}.role` as keyof typeof errors] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="author">Author</SelectItem>
                                                                        <SelectItem value="co-author">Co-Author</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors[`contributors.${index}.role` as keyof typeof errors] && (
                                                                    <p className="text-sm text-red-600 mt-1">
                                                                        {errors[`contributors.${index}.role` as keyof typeof errors]}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                type="button"
                                                asChild
                                                variant="outline"
                                                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                <Link href={route('user.submissions.index')}>
                                                    Cancel
                                                </Link>
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-xl hover:from-[#4CB050] hover:to-[#E52531] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? 'Submitting...' : 'Submit Abstract'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}