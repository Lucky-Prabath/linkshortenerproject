---
description: Read this file to uderstand how to fetch data in the project.
---
# Data Fetching Guidelines
This document outlines the best practices and guidelines for fetching data in our Next.js application. Adhering to these guidelines will ensure consistentency, performance, and maintainability across the codebase.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS using Server Components for data fetching. NEVER use Client Components to fetch data.

## 2. Data Fetching Methods

ALWAYS use the helper function in the /data directory to fetch data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions.