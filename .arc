@app
# ! name cannot start with "aws" if deployed with Arc (instead of Begin)
aws-lite_org
# * suggested alternative:
# org_aws-lite

@static
prune true

@plugins
enhance/arc-plugin-enhance
enhance/arc-plugin-styles
enhance/styles-cribsheet

@enhance-styles
config styleguide.json

@aws
runtime nodejs20.x

@begin
appID B6FLDG2K
