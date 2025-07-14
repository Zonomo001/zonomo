# Service-Related Changes Documentation

This document outlines the changes made to adapt the Zonomo marketplace from selling digital products to offering house services, focusing on the modifications to the `Products` collection and related configurations.

## Products Collection Transformation

**File Address:** `src/collections/Products/Products.ts`

While the collection retains its original name `Products` to minimize complexity and refactoring, its underlying schema and purpose have been updated to support service listings. This file now defines the data structure for individual services offered by service providers. Key modifications include:

### Updated Fields:
- **Service Name:** Replaces the 'Product Name' field, reflecting the nature of the offering.
- **Service Details:** A more comprehensive text area for detailed service descriptions.
- **Price per hour (USD):** The pricing model has shifted from a one-time product price to an hourly rate for services.
- **Service Category:** The dropdown options for categories have been replaced with house service-specific categories (e.g., Cleaning Services, Plumbing, Electrical, Carpentry, Painting, Gardening). These are defined in `src/config/index.ts`.
- **Service Type:** A new field to specify if a service is a 'One-time Service' or a 'Recurring Service'.
- **Service Duration (hours):** A numerical field allowing providers to specify the estimated duration of their service.
- **Service Availability:** A crucial new array field that enables service providers to define their working days and specific time slots (`startTime` and `endTime` in 24-hour format) when they are available to perform services.
- **Service Location:** A text field added to specify the geographical area or city the service provider operates in.
- **Service Documents:** The existing `product_files` relationship has been repurposed to link to any relevant documents for the service (e.g., certifications, portfolio). Its `required` status has been changed to `false` as not all services may need associated files.
- **Service Status:** Renamed from 'Product Status', this field (pending/approved/denied) remains for administrative approval of services.

### Impact on Payload CMS Admin Panel:
When service providers (or administrators) access the 'Products' section within the Payload CMS admin interface, they will now encounter a form reflecting these updated fields. This allows them to:
- Create new service listings with detailed descriptions and pricing.
- Specify the type and duration of their services.
- **Crucially, define their availability schedule**, which will be used for client bookings.
- Upload images relevant to their services.

This transformation lays the groundwork for shifting the platform's focus from digital asset sales to a comprehensive freelancing marketplace for house services, leveraging the existing Payload CMS structure. 