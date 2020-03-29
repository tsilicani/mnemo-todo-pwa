# when duplicate this:

# can be not?
vue create . 

rm -rf node_modules
npm install

# invalidation 
aws cloudfront create-invalidation --distribution-id BLABLA --paths "/*"

echo "# blabla" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:tsilicani/mnemo-todo-pwa.git
git push -u origin master