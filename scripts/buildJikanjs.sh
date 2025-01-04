# This scripts will build the Jikan.js for Node.js using Deno.
# Note that this script is nasty and will be replaced with a proper build system in the future.
# It isn't officially supported by the Jikan.js library, but it works for now.

set -e

echo "Starting Jikan.js build process..."

# Remove existing modules directory if it exists
rm -rf modules
echo "Removed existing modules directory."

# Clone the Jikan.js repository
if [ ! -d "Jikan.js" ]; then
  git clone https://github.com/RPDJF/Jikan.js.git
  echo "Cloned Jikan.js repository."
else
  echo "Jikan.js repository already exists."
fi

cd Jikan.js

# Pull the latest changes
git pull
echo "Pulled latest changes from Jikan.js repository."

# Run the build script
deno run -A ./build_npm.ts 0.0.1 || ~/.deno/bin/deno run -A ./build_npm.ts 0.0.1
echo "Built Jikan.js library."

cd -

# Create the modules directory
mkdir -p modules/Jikan.js
echo "Created modules/Jikan.js directory."

# Move the built npm package to the modules directory
mv ./Jikan.js/npm ./modules/Jikan.js/
echo "Moved built Jikan.js library to modules directory."

echo "Jikan.js build process completed."