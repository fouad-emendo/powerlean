import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== PowerLean Grid Data Schema ===============================================
This schema defines data models for storing grid layouts and widget 
configurations for the PowerLean Grid application.
=========================================================================*/
const schema = a.schema({
  GridLayout: a
    .model({
      name: a.string().required(),
      rows: a.integer().required(),
      columns: a.integer().required(),
      layout: a.json(), // GridStack layout configuration
      userId: a.string(), // Optional: for user-specific layouts
      isDefault: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),
  
  Widget: a
    .model({
      gridLayoutId: a.id().required(),
      widgetId: a.string().required(),
      type: a.enum(['link', 'embed', 'powerapp']),
      title: a.string(),
      url: a.url(),
      position: a.json(), // { x, y, width, height }
      config: a.json(), // Additional widget configuration
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),
    
  // Keep the original Todo for reference
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== Usage Examples ========================================================
// Create a new grid layout
const newLayout = await client.models.GridLayout.create({
  name: "My Dashboard",
  rows: 3,
  columns: 3,
  layout: gridStackData,
  isDefault: true
});

// Add widgets to the layout
const widget = await client.models.Widget.create({
  gridLayoutId: newLayout.data.id,
  widgetId: "widget-1",
  type: "link",
  title: "Google",
  url: "https://google.com",
  position: { x: 0, y: 0, width: 2, height: 2 }
});

// Fetch all layouts
const { data: layouts } = await client.models.GridLayout.list();

// Fetch widgets for a specific layout
const { data: widgets } = await client.models.Widget.list({
  filter: { gridLayoutId: { eq: layoutId } }
});
=========================================================================*/
