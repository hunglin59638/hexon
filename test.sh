pnpm run build
rm -rf server/data
rm -rf ./**/node_modules
pnpm run setup
echo "
  Login
  Logout
  View post
  Edit post
  New post
  hexo 3 commands are correct
  git 2 commands are correct
"
pnpm run start
