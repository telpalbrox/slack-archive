import React from 'react';

const getLinkHTML = (href) => {
    return `<link rel="preload" as="style" href=${href} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href=${href}></noscript>`;
};

export const LinkCSS = ({ href }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: getLinkHTML(href) }} />
    );
}
