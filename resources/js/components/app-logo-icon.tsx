import React from "react";

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/assets/logo.png" 
            alt="App Logo"
            width={props.width || 60} 
            height={props.height || 63} 
            className={`brightness-110 ${props.className || ''}`} 
            style={{
                filter: "contrast(110%)", 
                ...props.style
            }}
        />
    );
}