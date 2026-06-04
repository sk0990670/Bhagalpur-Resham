const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf-8');
    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync(fullPath, content);
}

replaceInFile('src/App.tsx', [
    [/import React(?:, \{[^}]+\})? from 'react';\r?\n?/g, '']
]);

replaceInFile('src/features/admin/pages/AdminLoginPage.tsx', [
    [/import React, \{ useState \} from 'react';\r?\n?/g, "import { useState } from 'react';\n"],
    [/handleLogin = \(e\) => \{/g, 'handleLogin = (e: React.FormEvent) => {']
]);

replaceInFile('src/features/admin/pages/ContentManagementPage.tsx', [
    [/https: /g, ''] // removing https inside style or whatever it was
]);

replaceInFile('src/features/admin/pages/CustomerManagementPage.tsx', [
    [/disabled="true"/g, 'disabled={true}']
]);

replaceInFile('src/features/admin/pages/DashboardPage.tsx', [
    [/as const/g, ''],
    [/weight: '500'/g, "weight: 'normal'"] 
]);

replaceInFile('src/features/admin/pages/OrdersManagementPage.tsx', [
    [/disabled="true"/g, 'disabled={true}']
]);

replaceInFile('src/features/admin/pages/ProductManagementPage.tsx', [
    [/disabled="true"/g, 'disabled={true}']
]);

replaceInFile('src/features/admin/pages/SareeCreationPage.tsx', [
    [/, useNavigate/g, ''],
    [/rows="4"/g, 'rows={4}']
]);

replaceInFile('src/features/auth/pages/LoginPage.tsx', [
    [/import \{ Link/g, "import React from 'react';\nimport { Link"]
]);

replaceInFile('src/features/cms/pages/ContactUsPage.tsx', [
    [/rows="5"/g, 'rows={5}']
]);

replaceInFile('src/shared/components/Preloader.tsx', [
    [/import React, \{ useEffect, useRef, useState \} from 'react';\r?\n?/g, "import { useEffect, useRef, useState } from 'react';\n"],
    [/useRef\(null\)/g, "useRef<HTMLVideoElement>(null)"]
]);
