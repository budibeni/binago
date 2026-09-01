import { buildRentalVehicleContext } from './data/modules/rental/services/vehicleContextBuilder';

async function test() {
  console.log('Building context for veh-006...');
  const ctx = await buildRentalVehicleContext('veh-006');
  console.log(JSON.stringify(ctx, null, 2));
}

test().catch(console.error);
