'use client';

import React from 'react';
import {
    AcademicCapIcon as AcademicCapIconOutline,
    ArrowPathIcon,
    ArrowLeftIcon,
    ArrowLeftOnRectangleIcon,
    ArrowRightIcon,
    ArrowUpRightIcon,
    Bars3Icon,
    BeakerIcon,
    BoltIcon,
    BookmarkIcon,
    BookOpenIcon,
    BriefcaseIcon,
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    BuildingOfficeIcon,
    CalculatorIcon,
    CalendarDaysIcon,
    CalendarIcon,
    ChartBarIcon,
    ChatBubbleBottomCenterTextIcon,
    ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
    CheckBadgeIcon as CheckBadgeIconOutline,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon as ClockIconOutline,
    ComputerDesktopIcon,
    CubeIcon,
    DevicePhoneMobileIcon,
    DocumentChartBarIcon,
    DocumentTextIcon,
    EnvelopeIcon as EnvelopeIconOutline,
    ExclamationTriangleIcon,
    EyeIcon,
    FlagIcon,
    HeartIcon,
    HomeIcon,
    InformationCircleIcon,
    LightBulbIcon,
    LockClosedIcon,
    MapPinIcon as MapPinIconOutline,
    MicrophoneIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    PhoneIcon as PhoneIconOutline,
    PhotoIcon,
    PresentationChartLineIcon,
    PuzzlePieceIcon,
    QuestionMarkCircleIcon,
    RocketLaunchIcon as RocketLaunchIconOutline,
    ShareIcon,
    ShieldCheckIcon as ShieldCheckIconOutline,
    SparklesIcon as SparklesIconOutline,
    StarIcon as StarIconOutline,
    TrophyIcon as TrophyIconOutline,
    UserCircleIcon,
    UserGroupIcon as UserGroupIconOutline,
    UserIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import {
    AcademicCapIcon as AcademicCapIconSolid,
    BookOpenIcon as BookOpenIconSolid,
    BuildingLibraryIcon as BuildingLibraryIconSolid,
    BuildingOfficeIcon as BuildingOfficeIconSolid,
    CalendarDaysIcon as CalendarDaysIconSolid,
    CalendarIcon as CalendarIconSolid,
    ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
    CheckBadgeIcon as CheckBadgeIconSolid,
    ClockIcon as ClockIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
    MapPinIcon as MapPinIconSolid,
    PhoneIcon as PhoneIconSolid,
    PhotoIcon as PhotoIconSolid,
    RocketLaunchIcon as RocketLaunchIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid,
    SparklesIcon as SparklesIconSolid,
    StarIcon as StarIconSolid,
    TrophyIcon as TrophyIconSolid,
    UserGroupIcon as UserGroupIconSolid,
    UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';

type IconVariant = 'outline' | 'solid';

interface IconProps {
    name: string;
    variant?: IconVariant;
    size?: number;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: any;
}

const outlineIcons: Record<string, React.ComponentType<any>> = {
    AcademicCapIcon: AcademicCapIconOutline,
    ArrowPathIcon,
    ArrowLeftIcon,
    ArrowLeftOnRectangleIcon,
    ArrowRightIcon,
    ArrowUpRightIcon,
    Bars3Icon,
    BeakerIcon,
    BoltIcon,
    BookmarkIcon,
    BookOpenIcon,
    BriefcaseIcon,
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    BuildingOfficeIcon,
    CalculatorIcon,
    CalendarDaysIcon,
    CalendarIcon,
    ChartBarIcon,
    ChatBubbleBottomCenterTextIcon,
    ChatBubbleLeftRightIcon: ChatBubbleLeftRightIconOutline,
    CheckBadgeIcon: CheckBadgeIconOutline,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon: ClockIconOutline,
    ComputerDesktopIcon,
    CubeIcon,
    DevicePhoneMobileIcon,
    DocumentChartBarIcon,
    DocumentTextIcon,
    EnvelopeIcon: EnvelopeIconOutline,
    ExclamationTriangleIcon,
    EyeIcon,
    FlagIcon,
    HeartIcon,
    HomeIcon,
    InformationCircleIcon,
    LightBulbIcon,
    LockClosedIcon,
    MapPinIcon: MapPinIconOutline,
    MicrophoneIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    PhoneIcon: PhoneIconOutline,
    PhotoIcon,
    PresentationChartLineIcon,
    PuzzlePieceIcon,
    RocketLaunchIcon: RocketLaunchIconOutline,
    ShareIcon,
    ShieldCheckIcon: ShieldCheckIconOutline,
    SparklesIcon: SparklesIconOutline,
    StarIcon: StarIconOutline,
    TrophyIcon: TrophyIconOutline,
    UserCircleIcon,
    UserGroupIcon: UserGroupIconOutline,
    UserIcon,
    XCircleIcon,
    XMarkIcon,
};

const solidIcons: Record<string, React.ComponentType<any>> = {
    AcademicCapIcon: AcademicCapIconSolid,
    BookOpenIcon: BookOpenIconSolid,
    BuildingLibraryIcon: BuildingLibraryIconSolid,
    BuildingOfficeIcon: BuildingOfficeIconSolid,
    CalendarDaysIcon: CalendarDaysIconSolid,
    CalendarIcon: CalendarIconSolid,
    ChatBubbleLeftRightIcon: ChatBubbleLeftRightIconSolid,
    CheckBadgeIcon: CheckBadgeIconSolid,
    ClockIcon: ClockIconSolid,
    EnvelopeIcon: EnvelopeIconSolid,
    MapPinIcon: MapPinIconSolid,
    PhoneIcon: PhoneIconSolid,
    PhotoIcon: PhotoIconSolid,
    RocketLaunchIcon: RocketLaunchIconSolid,
    ShieldCheckIcon: ShieldCheckIconSolid,
    SparklesIcon: SparklesIconSolid,
    StarIcon: StarIconSolid,
    TrophyIcon: TrophyIconSolid,
    UserGroupIcon: UserGroupIconSolid,
    UserIcon: UserIconSolid,
};

function AppIcon({
    name,
    variant = 'outline',
    size = 24,
    className = '',
    onClick,
    disabled = false,
    ...props
}: IconProps) {
    const iconSet = variant === 'solid' ? solidIcons : outlineIcons;
    const IconComponent = iconSet[name] || outlineIcons[name] || QuestionMarkCircleIcon;

    return (
        <IconComponent
            width={size}
            height={size}
            className={`${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
            onClick={disabled ? undefined : onClick}
            {...props}
        />
    );
}

export default AppIcon;
