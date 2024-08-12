# Update Activepieces Docker Instances
echo "Updating pds-integrate..."
git pull
docker compose pull
docker compose up -d --remove-orphans
echo "Successfully updated pds-integrate."
