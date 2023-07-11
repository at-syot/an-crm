ENVFILE=./app/.env.local
if [ ! -f "$ENVFILE" ]
then
  mkdir ./app
  tee -a ./app/.env.local <<EOF
    DB_HOST=anypay-db-tmp.cbkm16y0krx6.ap-southeast-1.rds.amazonaws.com
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=XReBXQka9wwFYnUlz8Uv
    DB_APIANYPAY=apianypay_db
    DB_ANPCRM=anp_crm

    AWS_REION=ap-southeast-1
    AWS_S3_BUCKET=manage-documents.anypay.co.th
    AWS_S3_PRESIGNED_EXPIRE_DURATION=3600

    LINELIFF_ID='1584232670-QOz40bj9'
EOF
fi

sudo docker pull 346774832960.dkr.ecr.ap-southeast-1.amazonaws.com/anp-crm:latest

sudo docker run -v ./app/.env.local:/web/.env.local -p 80:3000 -d 346774832960.dkr.ecr.ap-southeast-1.amazonaws.com/anp-crm:latest

aws ecr get-login-password --region ap-southeast-1 | sudo docker login --username AWS --password-stdin 346774832960.dkr.ecr.ap-southeast-1.amazonaws.com


