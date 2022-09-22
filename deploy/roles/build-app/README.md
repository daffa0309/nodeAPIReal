# Cara Pakai
## Prod/Staging/Cloud
`ansible-playbook deploy/playbook.yml -i deploy/hosts --private-key=~/.ssh/efaisal@asok.pem --extra-vars "appdir=/opt/periksa-api"`
## Development
`vagrant up`