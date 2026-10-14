-- ==============================================================================
-- PROJECT DHURANDHAR: SEED DATA (DEVELOPMENT & INITIAL TAXONOMY)
-- Complies with Section 7.2 and 9.3 of Developer Specification
-- ==============================================================================

-- 1. SEED TAXONOMY (12 Starting Topics)
INSERT INTO public.tags (id, label, slug) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Vision & Strategy', 'vision-strategy'),
  ('a0000001-0000-0000-0000-000000000002', 'Sales & Marketing', 'sales-marketing'),
  ('a0000001-0000-0000-0000-000000000003', 'Product & Technology', 'product-technology'),
  ('a0000001-0000-0000-0000-000000000004', 'AI & Automation', 'ai-automation'),
  ('a0000001-0000-0000-0000-000000000005', 'Operations & Delivery', 'operations-delivery'),
  ('a0000001-0000-0000-0000-000000000006', 'Hiring & Team', 'hiring-team'),
  ('a0000001-0000-0000-0000-000000000007', 'Finance & Revenue', 'finance-revenue'),
  ('a0000001-0000-0000-0000-000000000008', 'Customers', 'customers'),
  ('a0000001-0000-0000-0000-000000000009', 'Partnerships', 'partnerships'),
  ('a0000001-0000-0000-0000-000000000010', 'Setbacks & Lessons', 'setbacks-lessons'),
  ('a0000001-0000-0000-0000-000000000011', 'Milestones', 'milestones'),
  ('a0000001-0000-0000-0000-000000000012', 'Founder Reflections', 'founder-reflections')
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED MILESTONES (Road to 30CR Key Stages)
INSERT INTO public.revenue_milestones (id, title, description, milestone_date, visibility, sort_order) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Journey Launch', 'Official public declaration of Project Dhurandhar: Road to ₹30CR Revenue.', '2026-04-01', true, 1),
  ('b0000001-0000-0000-0000-000000000002', 'First ₹1 Crore Milestone', 'Crossing our initial operational run-rate milestone.', '2026-06-30', true, 2),
  ('b0000001-0000-0000-0000-000000000003', 'Scale-Up Phase ₹5 Crore', 'Enterprise delivery engine expansion across AI workflows.', '2026-09-30', true, 3),
  ('b0000001-0000-0000-0000-000000000004', 'Midpoint ₹15 Crore', 'Halfway mark towards our national enterprise automation target.', '2026-12-31', true, 4),
  ('b0000001-0000-0000-0000-000000000005', 'Ultimate Goal ₹30 Crore', 'Full target achievement of ₹30 Crore ARR.', '2027-03-31', true, 5)
ON CONFLICT DO NOTHING;


INSERT INTO public.companies (id, name, slug, description, website_url, logo_url, visibility) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'AI Automation Labs LLP', 'ai-automation-labs', 'Enterprise AI, agentic workflow automation and digital transformation lab.', 'https://automationlabs.online', '', 'public')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.people (id, name, slug, role, company_name, company_id, biography, visibility) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'Dr. Ajay Kumar', 'dr-ajay-kumar', 'Founder & Managing Partner', 'AI Automation Labs LLP', 'c0000001-0000-0000-0000-000000000001', 'Leading AI Automation Labs LLP on the mission to build a ₹30 Crore enterprise automation firm. Chronicling the journey daily on Project Dhurandhar.', 'public')
ON CONFLICT (slug) DO NOTHING;
