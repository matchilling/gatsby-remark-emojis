const assert = require('chai').assert;
const component = require('.');
const pkg = require('./package.json');
const sinon = require('sinon');

describe(`${pkg.name}@${pkg.version}`, () => {
  it('component exports a function "mutateSource"', () => {
    assert.equal(typeof component.mutateSource, 'function');
  });

  describe('#mutateSource', () => {
    let content;
    let markdownNode, options = {};

    beforeEach(() => {
      content = new String('Some content :100:!');
      sinon.spy(content, 'replace');

      markdownNode = {
        internal: { content }
      };
      options = {
        active: true,
        size: 16
      };
    });

    it('throws a TypeError if first argument is undefined', () => {
      assert.throws(
        () => component.mutateSource(),
        TypeError,
        'Cannot destructure property `markdownNode` of \'undefined\' or \'null\''
      );
    });

    it('returns a promise', () => {
      component.mutateSource({ markdownNode: {} }).then(res => {
        assert.equal(res, undefined);
      });
    });

    it('renders an emoji correctly', async () => {
      await component.mutateSource({ markdownNode }, options);

      assert.equal(
        markdownNode.internal.content,
        'Some content <img alt="emoji-100" data-icon="emoji-100" style="" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACMVBMVEUAAADdAADHAADLAADPAADnAAC9AAD/AADMAADxAAC0AADOAADHAADLAADKAADBAADJAADCAADCAADZAADCAADOAADMAAC+AADfAADFAADJAADVAAC9AADEAADTAAC+AADIAADTAADUAADEAADNAADNAADCAADLAACyAADHAADcAADZAADVAADQAADMAADHAADSAADNAADNAADJAADHAADOAADOAADHAADHAADLAADRAADIAADEAADIAADEAADIAADKAADHAADDAADIAADFAADPAADIAADEAADEAADGAADDAADJAADHAADFAADCAADLAADFAAC+AADMAADHAADFAADGAADFAADFAADKAADGAADEAADHAADJAADEAADLAADFAADHAADEAADnAADHAADGAADEAADaAADGAADDAAD/AADIAADDAADFAADFAADMAADFAADGAADFAADKAADEAADCAADOAADGAADCAADHAADEAADEAADDAADIAADDAADDAADDAADJAADEAAC9AADeAADIAADIAADJAADKAADIAADIAADKAADJAADFAADSAADIAADGAADFAADFAADEAADEAADGAADFAADLAADGAADOAADGAADFAADIAADKAADGAADHAADJAADMAADWAADOAADKAADHAADGAADFAADFAADEAADEAADGAADIAADPAADGAADEAADEAADEAADDAADDAADEAAC3AAC/AADBAADMAADEAAC/AAD///+tF0hqAAAAunRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBgALEgAIMRVkfSIckngyEIbJgLBYc4mRRHAWlOe0tks6q7kpSokBE1G5lq8PVOOfA22APq+HiQSW43QIqlMBiX17ikW8qJhsthgftzFDvr1dMKKpR1GPAwMpRz5QTzECaVIQd6i1sJ+SWgU2GRNkVkNISUM7EwUqYI+vt7SmloEyIJybaj8kEwkEAQAEEQSeblC8AAAAAWJLR0S6o7FH2gAAAAd0SU1FB+ELBRcGAB7xsdcAAADmSURBVBjTY2AAA0YtbR0mXT19ZjCPxcDQyNjE1MzcwpKVjYGBncPK2sbWzt7B0cnZhZOLgYHb1c3dw9PL28fXzz8gkIeBgTcoOCQ0LDwiMio6JpaPH2iEQFx8QmJSckpqWnqGoBADg3BmVnZObl5+QWFRcYkIUIFoaVl5RWVVdU1tXb2YOAODhGRDY1NzS2tbe0dnlxRQgbRMd09vX/+EiZMmT5kqCxSQk582fcbMWbPnzJ03f4GCIlBEaeGixUuWLlu+YuWq1coqQAHVNWvXrd+wcdPmLVu3qYF8or59x04NTQbiAQC/7kM2eey3NQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMS0wNVQxODo0OTo1MCswMDowMBRcY7AAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTEtMDVUMTM6NTM6NDgrMDA6MDCrIWVfAAAAAElFTkSuQmCC" title="emoji-100" />!'
      );
    });

    describe('plugin options', () => {
      let content;
      let markdownNode, options = {};

      beforeEach(() => {
        content = new String('Some content :100:!');
        sinon.spy(content, 'replace');

        markdownNode = {
          internal: { content }
        };
        options = {
          active : true,
          class  : 'emoji-icon',
          size   : 16,
          styles : {
            display      : 'inline',
            margin       : '0',
            'margin-top' : '1px',
            position     : 'relative',
            top          : '5px',
            width        : '25px'
          }
        };
      });

      describe('active', () => {
        it('does not change source if not active', () => {
          options.active = false;
          component.mutateSource({ markdownNode }, options)
          .then(res => {
            sinon.assert.notCalled(markdownNode.internal.content.replace);
            assert.equal(res, undefined);
          });
        });
      });
      describe('class', () => {
        it('adds a "class" attribute', async () => {
          await component.mutateSource({ markdownNode }, options);

          sinon.assert.calledOnce(content.replace);
          assert.include(markdownNode.internal.content, 'class="emoji-icon"');
        });
      });
      describe('styles', () => {
        it('adds a "style" attribute', async () => {
          await component.mutateSource({ markdownNode }, options);

          sinon.assert.calledOnce(content.replace);
          assert.include(
            markdownNode.internal.content,
            'style="display: inline; margin: 0; margin-top: 1px; position: relative; top: 5px; width: 25px"'
          );
        });
      });
    });
  });
});
