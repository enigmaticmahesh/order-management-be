import Joi from 'joi';
import { join } from 'path';

export const isDrizzleDataValid = () => {
  // Native Node.js 22+ feature: Loads the .env file directly into process.env 🚀
  process.loadEnvFile(join(process.cwd(), '.env'));

  // 2. Define your explicit Environment Schema Contract
  const envSchema = Joi.object({
    // DATABASE_HOST: Joi.string().required(),
    // DATABASE_PORT: Joi.string().required(),
    // DATABASE_USERNAME: Joi.string().required(),
    // DATABASE_PASSWORD: Joi.string().required(),
    // DATABASE_NAME: Joi.string().required(),
    PROD_DATABASE_URL: Joi.string().required(),
    DEV_DATABASE_URL: Joi.string().required(),
    MODE: Joi.string().required(),
  }).unknown(); // ◄ .unknown() prevents Joi from crashing on OS-injected variables

  // 3. Execute the validation sweep against the live process context
  const { error, value: validatedEnv } = envSchema.validate(process.env, {
    abortEarly: false, // ◄ Lists all missing variables at once, not just the first one
  });

  // 4. If any variables are missing, print details and abort the process
  if (error) {
    console.error(
      '\n🛑 CONFIGURATION ERROR: Missing or Invalid Database Environment Variables:',
    );
    error.details.forEach((detail) => {
      console.error(`   - ${detail.message}`); // Prints descriptive feedback
    });
    console.error('❌ Database migration/generation sequence aborted.\n');
    process.exit(1); // ◄ Hard stop code execution instantly!
  }

  return validatedEnv;
};
