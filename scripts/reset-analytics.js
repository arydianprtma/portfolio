const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting analytics...');
  
  // 1. Delete all event logs
  const deletedViews = await prisma.pageViewEvent.deleteMany({});
  const deletedCv = await prisma.cvDownloadEvent.deleteMany({});
  console.log(`Deleted ${deletedViews.count} page view events and ${deletedCv.count} cv download events.`);

  // 2. Reset Analytics table counter
  await prisma.analytics.upsert({
    where: { id: 'analytics_default' },
    update: {
      pageViews: 0,
      cvDownloads: 0,
    },
    create: {
      id: 'analytics_default',
      pageViews: 0,
      cvDownloads: 0,
    },
  });
  console.log('Analytics table reset to 0 (pageViews: 0, cvDownloads: 0).');

  // 3. Reset store.json if exists
  const storePath = path.join(__dirname, '../data/store.json');
  if (fs.existsSync(storePath)) {
    try {
      const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
      if (store.analytics) {
        store.analytics.pageViews = 0;
        store.analytics.cvDownloads = 0;
        fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
        console.log('store.json analytics reset to 0.');
      }
    } catch (e) {
      console.warn('Could not update store.json:', e.message);
    }
  }

  console.log('ALL ANALYTICS SUCCESSFULLY RESET TO 0!');
}

main()
  .catch((err) => {
    console.error('Error resetting analytics:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
