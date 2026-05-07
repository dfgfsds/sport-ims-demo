# Command to push the code to cpanel

npm run build && zip -r dist.zip dist && scp dist.zip jl7feywknnlh@sport-ims.in:~ && ssh jl7feywknnlh@sport-ims.in 'cd ~/public_html/admin.sport-ims.in && rm -rf * && unzip ~/dist.zip && mv dist/* . && rm -rf dist dist.zip'
